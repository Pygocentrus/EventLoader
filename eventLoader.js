'use strict';

;(function(document) {

  var eventLoader = function() {};

  /**
   * Compiles a template with a set of variables
   *
   * vocabulary: if / else / for in + raw vars, all in {{}}
   * tip: use eval() native JS function
   *
   * @param  {String} tpl  The input HTML
   * @param  {Object} data The data to inject into the template
   * @return {String}      The parsed output HTML
   */
  eventLoader.prototype.compile = function(tpl, data) {
    var _this = this,
        conditionnalStatement = /\{\{\s*if\(\s?([a-zA-Z0-9\_\.\=\&\!\?\:\|\>\<\(\)\s\+\*\/\'\"]+)\s?\)\s*\}\}/g,
        loopStatement = /\{\{\s*for\s?\(\s?([a-zA-Z0-9\_]+)\s+in\s+([a-zA-Z0-9\_\.]+\s?\))\s*\}\}/g,
        varStatement = /\{\{\s*([a-zA-Z0-9\.\_])\s*\}\}/g;

    //  TODO
  };

  eventLoader.prototype.render = function(tpl, selector) {
    var element = document.querySelector(selector) || null;

    if (element) {
      selector.innerHTML = tpl;
    }
  };

  /**
   * Attach an event to the selector and get resource when hovered.
   * The template, if found, can be returned within a callback
   * function or simply loaded into the DOM element.
   *
   * usage: eventLoader.attachEvent('.myLink', 'mouseover', '/path/to/tpl.html', function(data){ // code here });
   *
   * @param  {String}   selector         The query querySelector
   * @param  {Strinf}   eventType        The type of event to attach
   * @param  {String}   resource         /path/to/template
   * @param  {function} fn               The callback || null if rendering
   */
  eventLoader.prototype.attachEvent = function(selector, eventType, resource, fn) {
    var element = document.querySelector(selector) || null,
        _this = this,
        allowedEvents = ['click', 'dblclick', 'mousedown',
        'mouseup', 'mouseover', 'dragstart', 'drag', 'dragenter',
        'dragleave', 'dragover', 'dragend', 'drop', 'keyup',
        'keydown', 'keypress', 'resize', 'scroll', 'select',
        'change', 'submit', 'reset', 'focus', 'blur'];

    if (allowedEvents[eventType] && element && _this.isResource(resource)) {
      element.addEventListener(eventType, function(e) {
        e.preventDefault();
        e.stopPropagation();

        _this.getResource(resource, 'GET', function(res) {
          if (res.isOk) {
            fn(res.data);
          } else {
            throw new Error(res.message);
          }
        });
      });
    } else {
      var error = !element
                  ? 'Unknown DOM element'
                  : !allowedEvents[eventType] ? 'Invalid event' : 'Invalid resource';
      throw new Error(error);
    }
  };

  /**
   * Checks whether a string is a valid resource url
   * @param {String} url The resource url to test
   * @return {Boolean} Whether it's a valide resource
   */
  eventLoader.prototype.isResource = function(url) {
    return url.match(/(https?:\/\/[a-zA-Z0-9\.\-\_]+)?\/.+/);
  };

  /**
   * Grabs a resource and run a callback
   * @param {String}   path   /path/to/resource
   * @param {String}   method POST or GET
   * @param {Function} fn     The callback
   */
  eventLoader.prototype.getResource = function(path, method, fn) {
    var xmlhttp = window.XMLHttpRequest
                  ? new XMLHttpRequest()
                  : new ActiveXObject('Microsoft.XMLHTTP');

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        fn({isOk:true, data:xmlhttp.responseText});
      } else {
        fn({isOk:false, message:'Error while fetching data', status:xmlhttp.status});
      }
    };

    xmlhttp.open(method, path, true);
    xmlhttp.send();
  };

})(document);
