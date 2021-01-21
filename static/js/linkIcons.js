var $ = require('ep_etherpad-lite/static/js/rjquery').$;
var _ = require('ep_etherpad-lite/static/js/underscore');
var linkBoxes = require('ep_full_hyperlinks/static/js/linkBoxes');

// Indicates if Etherpad is configured to display icons
var displayIcons = ()=> {
  return clientVars.displayLinkAsIcon
}

// Easier access to outer pad
var padOuter;
var getPadOuter = ()=> {
  padOuter = padOuter || $('iframe[name="ace_outer"]').contents();
  return padOuter;
}

// Easier access to inner pad
var padInner;
var getPadInner = ()=> {
  padInner = padInner || getPadOuter().find('iframe[name="ace_inner"]').contents();
  return padInner;
}

var getOrCreateIconsContainerAt = (top)=> {
  var iconContainer = getPadOuter().find('#linkIcons');
  var iconClass = "icon-at-"+top;

  // is this the 1st link on that line?
  var iconsAtLine = iconContainer.find("."+iconClass);
  var isFirstIconAtLine = iconsAtLine.length === 0;

  // create container for icons at target line, if it does not exist yet
  if (isFirstIconAtLine) {
    iconContainer.append('<div class="link-icon-line '+iconClass+'"></div>');
    iconsAtLine = iconContainer.find("."+iconClass);
    iconsAtLine.css("top", top+"px");
  }

  return iconsAtLine;
}

var targetLinkIdOf = (e)=> {
  return e.currentTarget.getAttribute("data-linkid");
}

var highlightTargetTextOf = (linkId)=> {
  getPadInner().find("head").append("<style class='link-style'>."+linkId+"{ color: #a7680c !important }</style>");
}

var removeHighlightTargetText = (linkId)=> {
  getPadInner().find("head .link-style").remove();
}

var toggleActiveLinkIcon = (target)=> {
  target.toggleClass("active").toggleClass("inactive");
}

var addListenersToLinkIcons = ()=> {
  getPadOuter().find('#linkIcons').on("mouseover", ".link-icon", (e)=>{
    removeHighlightTargetText();
    var linkId = targetLinkIdOf(e);
    highlightTargetTextOf(linkId);
  }).on("mouseout", ".link-icon", (e)=>{
    var linkId = targetLinkIdOf(e);
    removeHighlightTargetText();
  }).on("click", ".link-icon.active", (e)=>{
    toggleActiveLinkIcon($(this));

    var linkId = targetLinkIdOf(e);
    linkBoxes.hideLink(linkId, true);
  }).on("click", ".link-icon.inactive", (e)=>{
    // deactivate/hide other link boxes that are opened, so we have only
    // one link box opened at a time
    linkBoxes.hideAllLinks();
    var allActiveIcons = getPadOuter().find('#linkIcons').find(".link-icon.active");
    toggleActiveLinkIcon(allActiveIcons);

    // activate/show only target link
    toggleActiveLinkIcon($(this));
    var linkId = targetLinkIdOf(e);
    linkBoxes.highlightLink(linkId, e);
  });
}

// Listen to clicks on the page to be able to close link when clicking
// outside of it
var addListenersToCloseOpenedLink = ()=> {
  // we need to add listeners to the different iframes of the page
  $(document).on("touchstart click", (e)=>{
    closeOpenedLinkIfNotOnSelectedElements(e);
  });
  getPadOuter().find('html').on("touchstart click", (e)=>{
    closeOpenedLinkIfNotOnSelectedElements(e);
  });
  getPadInner().find('html').on("touchstart click", (e)=>{
    closeOpenedLinkIfNotOnSelectedElements(e);
  });
}

// Close link if event target was outside of link or on a link icon
var closeOpenedLinkIfNotOnSelectedElements = (e)=> {
  // Don't do anything if clicked on the following elements:
  // any of the link icons
  if (shouldNotCloseLink(e) || linkBoxes.shouldNotCloseLink(e)) { // a link box or the link modal
    return;
  }

  // All clear, can close the link
  var openedLink = findOpenedLink();
  if (openedLink) {
    toggleActiveLinkIcon($(openedLink));

    var linkId = openedLink.getAttribute("data-linkid");
    linkBoxes.hideLink(linkId, true);
  }
}

// Search on the page for an opened link
var findOpenedLink = ()=> {
  return getPadOuter().find('#linkIcons .link-icon.active').get(0);
}

/* ***** Public methods: ***** */

// Create container to hold link icons
var insertContainer = ()=> {
  // we're only doing something if icons will be displayed at all
  if (!displayIcons()) return;

  getPadOuter().find("#sidediv").after('<div id="linkIcons"></div>');
  getPadOuter().find("#links").addClass('with-icons');
  addListenersToLinkIcons();
  addListenersToCloseOpenedLink();
}

// Create a new link icon
var addIcon = (linkId, link)=>{
  // we're only doing something if icons will be displayed at all
  if (!displayIcons()) return;

  var inlineLink = getPadInner().find(".link."+linkId);
  var top = inlineLink.get(0).offsetTop;
  var iconsAtLine = getOrCreateIconsContainerAt(top);
  var icon = $('#linkIconTemplate').tmpl(link);

  icon.appendTo(iconsAtLine);
}

// Hide link icons from container
var hideIcons = ()=> {
  // we're only doing something if icons will be displayed at all
  if (!displayIcons()) return;

  getPadOuter().find('#linkIcons').children().children().each((){
    $(this).hide();
  });
}

// Adjust position of the link icon on the container, to be on the same
// height of the pad text associated to the link, and return the affected icon
var adjustTopOf = (linkId, baseTop)=> {
  // we're only doing something if icons will be displayed at all
  if (!displayIcons()) return;

  var icon = getPadOuter().find('#icon-'+linkId);
  var targetTop = baseTop;
  var iconsAtLine = getOrCreateIconsContainerAt(targetTop);

  // move icon from one line to the other
  if (iconsAtLine != icon.parent()) icon.appendTo(iconsAtLine);

  icon.show();

  return icon;
}

// Indicate if link detail currently opened was shown by a click on
// link icon.
var isLinkOpenedByClickOnIcon = ()=> {
  // we're only doing something if icons will be displayed at all
  if (!displayIcons()) return false;

  var iconClicked = getPadOuter().find('#linkIcons').find(".link-icon.active");
  var linkOpenedByClickOnIcon = iconClicked.length !== 0;

  return linkOpenedByClickOnIcon;
}

// Mark link as a link-with-reply, so it can be displayed with a
// different icon
var linkHasReply = (linkId)=> {
  // we're only doing something if icons will be displayed at all
  if (!displayIcons()) return;

  // change link icon
  var iconForLink = getPadOuter().find('#linkIcons').find("#icon-"+linkId);
  iconForLink.addClass("with-reply");
}

// Indicate if sidebar link should be shown, checking if it had the characteristics
// of a link that was being displayed on the screen
var shouldShow = (sidebarComent)=> {
  var shouldShowLink = false;

  if (!displayIcons()) {
    // if icons are not being displayed, we always show links
    shouldShowLink = true;
  } else if (sidebarComent.hasClass("mouseover")) {
    // if icons are being displayed, we only show links clicked by user
    shouldShowLink = true;
  }

  return shouldShowLink;
}

// Indicates if event was on one of the elements that does not close link (any of the link icons)
var shouldNotCloseLink = (e)=> {
  return $(e.target).closest('.link-icon').length !== 0;
}

exports.insertContainer = insertContainer;
exports.addIcon = addIcon;
exports.hideIcons = hideIcons;
exports.adjustTopOf = adjustTopOf;
exports.isLinkOpenedByClickOnIcon = isLinkOpenedByClickOnIcon;
exports.linkHasReply = linkHasReply;
exports.shouldShow = shouldShow;
exports.shouldNotCloseLink = shouldNotCloseLink;
