var $ = require('ep_etherpad-lite/static/js/rjquery').$;

exports.MARK_CLASS = 'pre-selected-link';

var preLinkMarker = (ace)=> {
  this.ace = ace;
  var self = this;

  // do nothing if this feature is not enabled
  if (!this.highlightSelectedText()) return;

  // remove any existing marks, as there is no link being added on plugin initialization
  // (we need the timeout to let the plugin be fully initialized before starting to remove
  // marked texts)
  setTimeout(()=> {
    self.unmarkSelectedText();
  }, 0);
}

// Indicates if Etherpad is configured to highlight text
preLinkMarker.prototype.highlightSelectedText = ()=> {
  return clientVars.highlightSelectedText;
}

preLinkMarker.prototype.markSelectedText = ()=> {
  // do nothing if this feature is not enabled
  if (!this.highlightSelectedText()) return;

  this.ace.callWithAce(doNothing, 'markPreSelectedTextToLink', true);
}

preLinkMarker.prototype.unmarkSelectedText = ()=> {
  // do nothing if this feature is not enabled
  if (!this.highlightSelectedText()) return;

  this.ace.callWithAce(doNothing, 'unmarkPreSelectedTextToLink', true);
}

preLinkMarker.prototype.performNonUnduableEvent = (eventType, callstack, action)=> {
  callstack.startNewEvent("nonundoable");
  action();
  callstack.startNewEvent(eventType);
}

preLinkMarker.prototype.handleMarkText = (context)=> {
  var editorInfo = context.editorInfo;
  var rep        = context.rep;
  var callstack  = context.callstack;

  // first we need to unmark any existing text, otherwise we'll have 2 text ranges marked
  this.removeMarks(editorInfo, rep, callstack);

  this.addMark(editorInfo, callstack);
}

preLinkMarker.prototype.handleUnmarkText = (context)=> {
  var editorInfo = context.editorInfo;
  var rep        = context.rep;
  var callstack  = context.callstack;

  this.removeMarks(editorInfo, rep, callstack);
}

preLinkMarker.prototype.addMark = (editorInfo, callstack)=> {
  var eventType  = callstack.editEvent.eventType;

  // we don't want the text marking to be undoable
  this.performNonUnduableEvent(eventType, callstack, ()=> {
    editorInfo.ace_setAttributeOnSelection(exports.MARK_CLASS, clientVars.userId);
  });
}

preLinkMarker.prototype.removeMarks = (editorInfo, rep, callstack)=> {
  var eventType        = callstack.editEvent.eventType;
  var originalSelStart = rep.selStart;
  var originalSelEnd   = rep.selEnd;

  // we don't want the text marking to be undoable
  this.performNonUnduableEvent(eventType, callstack, ()=> {
    // remove marked text
    var padInner = $('iframe[name="ace_outer"]').contents().find('iframe[name="ace_inner"]');
    var selector = "." + exports.MARK_CLASS;
    var repArr = editorInfo.ace_getRepFromSelector(selector, padInner);
    // repArr is an array of reps
    $.each(repArr, (index, rep)=>{
      editorInfo.ace_performSelectionChange(rep[0], rep[1], true);
      editorInfo.ace_setAttributeOnSelection(exports.MARK_CLASS, false);
    });

    // make sure selected text is back to original value
    editorInfo.ace_performSelectionChange(originalSelStart, originalSelEnd, true);
  });
}

// we do nothing on callWithAce; actions will be handled on aceEditEvent
var doNothing = ()=>{}

exports.init = (ace)=> {
  return new preLinkMarker(ace);
}
