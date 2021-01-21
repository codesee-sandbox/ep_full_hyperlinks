var randomString = require('ep_etherpad-lite/static/js/pad_utils').randomString;
var _ = require('ep_etherpad-lite/static/js/underscore');
var shared = require('./shared');

exports.addTextOnClipboard = (e, ace, padInner, removeSelection, links, replies)=>{
  var linkIdOnFirstPositionSelected;
  var hasLinkOnSelection;
  ace.callWithAce((ace) =>{
    linkIdOnFirstPositionSelected = ace.ace_getLinkIdOnFirstPositionSelected();
    hasLinkOnSelection = ace.ace_hasLinkOnSelection();
  });

  if(hasLinkOnSelection){
    var linksData;
    var range = padInner.contents()[0].getSelection().getRangeAt(0);
    var rawHtml = createHiddenDiv(range);
    var html = rawHtml;
    var onlyTextIsSelected = selectionHasOnlyText(rawHtml);

    // when the range selection is fully inside a tag, 'rawHtml' will have no HTML tag, so we have to
    // build it. Ex: if we have '<span>ab<b>cdef</b>gh</span>" and user selects 'de', the value of
    //'rawHtml' will be 'de', not '<b>de</b>'. As it is not possible to have two links in the same text
    // linkIdOnFirstPositionSelected is the linkId in this partial selection
    if (onlyTextIsSelected) {
      var textSelected = rawHtml[0].textContent;
      html = buildHtmlToCopyWhenSelectionHasOnlyText(textSelected, range, linkIdOnFirstPositionSelected);
    }
    var linkIds = getLinkIds(html);
    linksData = buildLinksData(html, links);
    var htmlToCopy = replaceLinkIdsWithFakeIds(linksData, html)
    linksData = JSON.stringify(linksData);
    var replyData = getReplyData(replies, linkIds);
    replyData = JSON.stringify(replyData);
    e.originalEvent.clipboardData.setData('text/objectReply', replyData);
    e.originalEvent.clipboardData.setData('text/objectLink', linksData);
    // here we override the default copy behavior
    e.originalEvent.clipboardData.setData('text/html', htmlToCopy);
    e.preventDefault();

    // if it is a cut event we have to remove the selection
    if(removeSelection){
      padInner.contents()[0].execCommand("delete");
    }
  }
};

var getReplyData = (replies, linkIds)=>{
  var replyData = {};
  _.each(linkIds, (linkId)=>{
    replyData =  _.extend(getRepliesFromLinkId(replies, linkId), replyData);
  });
  return replyData;
};

var getRepliesFromLinkId = (replies, linkId)=>{
  var repliesFromLinkID = {};
  _.each(replies, (reply, replyId)=>{
    if(reply.linkId === linkId){
      repliesFromLinkID[replyId] = reply;
    }
  });
  return repliesFromLinkID;
};

var buildLinkIdToFakeIdMap = (linksData)=>{
  var linkIdToFakeId = {};
  _.each(linksData, (link, fakeLinkId)=>{
    var linkId = link.data.originalLinkId;
    linkIdToFakeId[linkId] = fakeLinkId;
  });
  return linkIdToFakeId;
};

var replaceLinkIdsWithFakeIds = (linksData, html)=>{
  var linkIdToFakeId =  buildLinkIdToFakeIdMap(linksData);
  _.each(linkIdToFakeId, (fakeLinkId, linkId)=>{
    $(html).find("." + linkId).removeClass(linkId).addClass(fakeLinkId);
  });
  var htmlWithFakeLinkIds = getHtml(html);
  return htmlWithFakeLinkIds;
};

var buildLinksData = (html, links)=>{
  var linksData = {};
  var originalLinkIds = getLinkIds(html);
  _.each(originalLinkIds, (originalLinkId)=>{
    var fakeLinkId = generateFakeLinkId();
    var link = links[originalLinkId];
    link.data.originalLinkId = originalLinkId;
    linksData[fakeLinkId] = link;
  });
  return linksData;
};

var generateFakeLinkId = ()=>{
  var linkId = "fakelink-" + randomString(16);
  return linkId;
};

var getLinkIds = (html)=>{
  var allSpans = $(html).find("span");
  var linkIds = [];
  _.each(allSpans, (span)=>{
    var cls = $(span).attr('class');
    var classLinkId = /(?:^| )(lc-[A-Za-z0-9]*)/.exec(cls);
    var linkId = (classLinkId) ? classLinkId[1] : false;
    if(linkId){
      linkIds.push(linkId);
    }
  });
  var uniqueLinkIds = _.uniq(linkIds);
  return uniqueLinkIds;
 };

var createHiddenDiv = (range)=>{
  var content = range.cloneContents();
  var div = document.createElement("div");
  var hiddenDiv = $(div).html(content);
  return hiddenDiv;
};

var getHtml = (hiddenDiv)=>{
  return $(hiddenDiv).html();
};

var selectionHasOnlyText = (rawHtml)=>{
  var html = getHtml(rawHtml);
  var htmlDecoded = htmlDecode(html);
  var text = $(rawHtml).text();
  return htmlDecoded === text;
};

var buildHtmlToCopyWhenSelectionHasOnlyText = (text, range, linkId)=> {
  var htmlWithSpans = buildHtmlWithTwoSpanTags(text, linkId);
  var html = buildHtmlWithFormattingTagsOfSelection(htmlWithSpans, range);

  var htmlToCopy = $.parseHTML("<div>" + html + "</div>");
  return htmlToCopy;
};

var buildHtmlWithFormattingTagsOfSelection = (html, range)=> {
  var htmlOfParentNode = range.commonAncestorContainer.parentNode;
  var tags = getTagsInSelection(htmlOfParentNode);

  // this case happens when we got a selection with one or more styling (bold, italic, underline, strikethrough)
  // applied in all selection in the same range. For example, <b><i><u>text</u></i></b>
  if(tags){
    html = buildOpenTags(tags) + html + buildCloseTags(tags);
  }

  return html;
}

// FIXME - Allow to copy a link when user copies only one char
// This is a hack to preserve the link classes when user pastes a link. When user pastes a span like this
// <span class='link c-124'>thing</span>, chrome removes the classes and keeps only the style of the class. With links
// chrome keeps the background-color. To avoid this we create two spans. The first one, <span class='link c-124'>thi</span>
// has the text until the last but one character and second one with the last character <span class='link c-124'>g</span>.
// Etherpad does a good job joining the two spans into one after the paste is triggered.
var buildHtmlWithTwoSpanTags = (text, linkId) =>{
  var firstSpan = '<span class="link ' + linkId + '">'+ text.slice(0, -1) + '</span>'; // text until before last char
  var secondSpan = '<span class="link ' + linkId + '">'+ text.slice(-1) + '</span>'; // last char

  return firstSpan + secondSpan;
}

var buildOpenTags = (tags)=>{
  var openTags = "";
  tags.forEach((tag)=>{
    openTags += "<"+tag+">";
  });
  return openTags;
};

var buildCloseTags = (tags)=>{
  var closeTags = "";
  var tags = tags.reverse();
  tags.forEach((tag)=>{
    closeTags += "</"+tag+">";
  });
  return closeTags;
};

var getTagsInSelection = (htmlObject)=>{
  var tags = [];
  var tag;
  if($(htmlObject)[0].hasOwnProperty("localName")){
    while($(htmlObject)[0].localName !== "span"){
      var html = $(htmlObject).prop('outerHTML');
      var stylingTagRegex = /<(b|i|u|s)>/.exec(html);
      tag = stylingTagRegex ? stylingTagRegex[1] : "";
      tags.push(tag);
      htmlObject = $(htmlObject).parent();
    }
  }
  return tags;
};

exports.saveLinksAndReplies = (e)=>{
  var links = e.originalEvent.clipboardData.getData('text/objectLink');
  var replies = e.originalEvent.clipboardData.getData('text/objectReply');
  if(links && replies) {
    links = JSON.parse(links);
    replies = JSON.parse(replies);
    saveLinks(links);
    saveReplies(replies);
  }
};

var saveLinks = (links)=>{
  var linksToSave = {};
  var padId = clientVars.padId;

  var mapOriginalLinksId = pad.plugins.ep_full_hyperlinks.mapOriginalLinksId;
  var mapFakeLinks = pad.plugins.ep_full_hyperlinks.mapFakeLinks;

  _.each(links, (link, fakeLinkId)=>{
    var linkData = buildLinkData(link, fakeLinkId);
    var newLinkId = shared.generateLinkId();
    mapFakeLinks[fakeLinkId] = newLinkId;
    var originalLinkId = link.data.originalLinkId;
    mapOriginalLinksId[originalLinkId] = newLinkId;
    linksToSave[newLinkId] = link;
  });
  pad.plugins.ep_full_hyperlinks.saveLinkWithoutSelection(padId, linksToSave);
};

var saveReplies = (replies)=>{
  var repliesToSave = {};
  var padId = clientVars.padId;
  var mapOriginalLinksId = pad.plugins.ep_full_hyperlinks.mapOriginalLinksId;
  _.each(replies, (reply, replyId)=>{
    var originalLinkId = reply.linkId;
    // as the link copied has got a new linkId, we set this id in the reply as well
    reply.linkId = mapOriginalLinksId[originalLinkId];
    repliesToSave[replyId] = reply;
  });
  pad.plugins.ep_full_hyperlinks.saveLinkReplies(padId, repliesToSave);
};

var buildLinkData = (link, fakeLinkId)=>{
  var linkData = {};
  linkData.padId = clientVars.padId;
  linkData.link = link.data;
  linkData.link.linkId = fakeLinkId;
  return linkData;
};

// copied from https://css-tricks.com/snippets/javascript/unescape-html-in-js/
var htmlDecode = (input) =>{
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
};

// here we find the link id on a position [line, column]. This  is used to get the link id
// of one line when there is ONLY text selected. E.g In the line with link, <span class='link...'>something</span>,
// and user copies the text 'omethin'. The span tags are not copied only the text. So as the link is
// applied on the selection we get the linkId using the first position selected of the line.
// P.S: It's not possible to have two or more links when there is only text selected, because for each link
// created it's generated a <span> and to copy only the text it MUST NOT HAVE any tag on the selection
exports.getLinkIdOnFirstPositionSelected = ()=> {
  var attributeManager = this.documentAttributeManager;
  var rep = this.rep;
  var linkId = _.object(attributeManager.getAttributesOnPosition(rep.selStart[0], rep.selStart[1])).link;
  return linkId;
};

exports.hasLinkOnSelection = ()=> {
  var hasLink;
  var attributeManager = this.documentAttributeManager;
  var rep = this.rep;
  var firstLineOfSelection = rep.selStart[0];
  var firstColumn = rep.selStart[1];
  var lastColumn = rep.selEnd[1];
  var lastLineOfSelection = rep.selEnd[0];
  var selectionOfMultipleLine = hasMultipleLineSelected(firstLineOfSelection, lastLineOfSelection);

  if(selectionOfMultipleLine){
    hasLink = hasLinkOnMultipleLineSelection(firstLineOfSelection,lastLineOfSelection, rep, attributeManager);
  }else{
    hasLink = hasLinkOnLine(firstLineOfSelection, firstColumn, lastColumn, attributeManager)
  }
  return hasLink;
};

var hasLinkOnMultipleLineSelection = (firstLineOfSelection, lastLineOfSelection, rep, attributeManager)=>{
  var foundLineWithLink = false;
  for (var line = firstLineOfSelection; line <= lastLineOfSelection && !foundLineWithLink; line++) {
    var firstColumn = getFirstColumnOfSelection(line, rep, firstLineOfSelection);
    var lastColumn = getLastColumnOfSelection(line, rep, lastLineOfSelection);
    var hasLink = hasLinkOnLine(line, firstColumn, lastColumn, attributeManager);
    if (hasLink){
      foundLineWithLink = true;
    }
  }
  return foundLineWithLink;
}

var getFirstColumnOfSelection = (line, rep, firstLineOfSelection)=>{
  return line !== firstLineOfSelection ? 0 : rep.selStart[1];
};

var getLastColumnOfSelection = (line, rep, lastLineOfSelection)=>{
  var lastColumnOfSelection;
  if (line !== lastLineOfSelection) {
    lastColumnOfSelection = getLength(line, rep); // length of line
  }else{
    lastColumnOfSelection = rep.selEnd[1] - 1; //position of last character selected
  }
  return lastColumnOfSelection;
};

var hasLinkOnLine = (lineNumber, firstColumn, lastColumn, attributeManager)=>{
  var foundLinkOnLine = false;
  for (var column = firstColumn; column <= lastColumn && !foundLinkOnLine; column++) {
    var linkId = _.object(attributeManager.getAttributesOnPosition(lineNumber, column)).link;
    if (linkId !== undefined){
      foundLinkOnLine = true;
    }
  }
  return foundLinkOnLine;
};

var hasMultipleLineSelected = (firstLineOfSelection, lastLineOfSelection)=>{
  return  firstLineOfSelection !== lastLineOfSelection;
};

var getLength = (line, rep)=> {
  var nextLine = line + 1;
  var startLineOffset = rep.lines.offsetOfIndex(line);
  var endLineOffset   = rep.lines.offsetOfIndex(nextLine);

  //lineLength without \n
  var lineLength = endLineOffset - startLineOffset - 1;

  return lineLength;
};
