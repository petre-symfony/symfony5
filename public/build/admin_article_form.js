(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["admin_article_form"],{

/***/ "./assets/js/admin_article_form.js":
/*!*****************************************!*\
  !*** ./assets/js/admin_article_form.js ***!
  \*****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_array_concat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.concat */ "./node_modules/core-js/modules/es.array.concat.js");
/* harmony import */ var core_js_modules_es_array_concat__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_concat__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_array_filter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.array.filter */ "./node_modules/core-js/modules/es.array.filter.js");
/* harmony import */ var core_js_modules_es_array_filter__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_filter__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_array_find__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.array.find */ "./node_modules/core-js/modules/es.array.find.js");
/* harmony import */ var core_js_modules_es_array_find__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_find__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_array_iterator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js");
/* harmony import */ var core_js_modules_es_array_iterator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_iterator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_array_join__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.array.join */ "./node_modules/core-js/modules/es.array.join.js");
/* harmony import */ var core_js_modules_es_array_join__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_join__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_array_map__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.array.map */ "./node_modules/core-js/modules/es.array.map.js");
/* harmony import */ var core_js_modules_es_array_map__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_map__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es_object_define_property__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.object.define-property */ "./node_modules/core-js/modules/es.object.define-property.js");
/* harmony import */ var core_js_modules_es_object_define_property__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_define_property__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");
/* harmony import */ var core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_es_promise__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.promise */ "./node_modules/core-js/modules/es.promise.js");
/* harmony import */ var core_js_modules_es_promise__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_promise__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var core_js_modules_es_string_iterator__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.string.iterator */ "./node_modules/core-js/modules/es.string.iterator.js");
/* harmony import */ var core_js_modules_es_string_iterator__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_iterator__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var core_js_modules_es_weak_set__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es.weak-set */ "./node_modules/core-js/modules/es.weak-set.js");
/* harmony import */ var core_js_modules_es_weak_set__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_weak_set__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var dropzone__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! dropzone */ "./node_modules/dropzone/dist/dropzone.js");
/* harmony import */ var dropzone__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(dropzone__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var dropzone_dist_dropzone_css__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! dropzone/dist/dropzone.css */ "./node_modules/dropzone/dist/dropzone.css");
/* harmony import */ var dropzone_dist_dropzone_css__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(dropzone_dist_dropzone_css__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var sortablejs__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! sortablejs */ "./node_modules/sortablejs/modular/sortable.esm.js");













function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }





dropzone__WEBPACK_IMPORTED_MODULE_13___default.a.autoDiscover = false;
jquery__WEBPACK_IMPORTED_MODULE_12___default()(document).ready(function () {
  var $autoComplete = jquery__WEBPACK_IMPORTED_MODULE_12___default()('.js-user-autocomplete');

  if (!$autoComplete.is(':disabled')) {
    Promise.all(/*! import() */[__webpack_require__.e(1), __webpack_require__.e(0)]).then(__webpack_require__.bind(null, /*! ./components/algolia-autocomplete */ "./assets/js/components/algolia-autocomplete.js")).then(function (autocomplete) {
      autocomplete["default"]($autoComplete, 'users', 'email');
    });
  }

  var $referenceList = jquery__WEBPACK_IMPORTED_MODULE_12___default()('.js-reference-list');

  if ($referenceList[0]) {
    var referenceList = new ReferenceList(jquery__WEBPACK_IMPORTED_MODULE_12___default()('.js-reference-list'));
    initializeDropzone(referenceList);
  }

  var $locationSelect = jquery__WEBPACK_IMPORTED_MODULE_12___default()('.js-article-form-location');
  var $specificLocationTarget = jquery__WEBPACK_IMPORTED_MODULE_12___default()('.js-specific-location-target');
  $locationSelect.on('change', function (e) {
    jquery__WEBPACK_IMPORTED_MODULE_12___default.a.ajax({
      url: $locationSelect.data('specific-location-url'),
      data: {
        location: $locationSelect.val()
      },
      success: function success(html) {
        if (!html) {
          $specificLocationTarget.find('select').remove();
          $specificLocationTarget.addClass('d-none');
          return;
        } // Replace the current field and show


        $specificLocationTarget.html(html).removeClass('d-none');
      }
    });
  });
}); // todo - use Webpack Encore so ES6 syntax is transpiled to ES5

var ReferenceList =
/*#__PURE__*/
function () {
  function ReferenceList($element) {
    var _this = this;

    _classCallCheck(this, ReferenceList);

    var stuff = new WeakSet([]);
    this.$element = $element;
    this.sortable = sortablejs__WEBPACK_IMPORTED_MODULE_15__["default"].create(this.$element[0], {
      handle: '.drag-handle',
      animation: 150,
      onEnd: function onEnd() {
        jquery__WEBPACK_IMPORTED_MODULE_12___default.a.ajax({
          url: _this.$element.data('url') + '/reorder',
          method: 'POST',
          data: JSON.stringify(_this.sortable.toArray())
        });
      }
    });
    this.references = [];
    this.render();
    this.$element.on('click', '.js-reference-delete', function (event) {
      _this.handleReferenceDelete(event);
    });
    this.$element.on('blur', '.js-edit-filename', function (event) {
      _this.handleReferenceEditFilename(event);
    });
    jquery__WEBPACK_IMPORTED_MODULE_12___default.a.ajax({
      url: this.$element.data('url')
    }).then(function (data) {
      _this.references = data;

      _this.render();
    });
  }

  _createClass(ReferenceList, [{
    key: "addReference",
    value: function addReference(reference) {
      this.references.push(reference);
      this.render();
    }
  }, {
    key: "handleReferenceDelete",
    value: function handleReferenceDelete(event) {
      var _this2 = this;

      var $li = jquery__WEBPACK_IMPORTED_MODULE_12___default()(event.currentTarget).closest('.list-group-item');
      var id = $li.data('id');
      $li.addClass('disabled');
      jquery__WEBPACK_IMPORTED_MODULE_12___default.a.ajax({
        url: '/admin/article/references/' + id,
        method: 'DELETE'
      }).then(function () {
        _this2.references = _this2.references.filter(function (reference) {
          return reference.id !== id;
        });

        _this2.render();
      });
    }
  }, {
    key: "handleReferenceEditFilename",
    value: function handleReferenceEditFilename(event) {
      var $li = jquery__WEBPACK_IMPORTED_MODULE_12___default()(event.currentTarget).closest('.list-group-item');
      var id = $li.data('id');
      var reference = this.references.find(function (reference) {
        return reference.id === id;
      });
      reference.originalFilename = jquery__WEBPACK_IMPORTED_MODULE_12___default()(event.currentTarget).val();
      jquery__WEBPACK_IMPORTED_MODULE_12___default.a.ajax({
        url: '/admin/article/references/' + id,
        method: 'PUT',
        data: JSON.stringify(reference)
      });
    }
  }, {
    key: "render",
    value: function render() {
      var itemsHtml = this.references.map(function (reference) {
        return "\n<li class=\"list-group-item d-flex justify-content-between align-items-center\" data-id=\"".concat(reference.id, "\">\n  <span class=\"drag-handle fa fa-reorder\"></span>\n  <input type=\"text\" value=\"").concat(reference.originalFilename, "\" class=\"form-control js-edit-filename\" style=\"width: auto;\">\n\n  <span>\n    <a href=\"/admin/article/references/").concat(reference.id, "/download\" class=\"btn btn-link btn-sm\"><span class=\"fa fa-download\" style=\"vertical-align: middle\"></span></a>\n    <button class=\"js-reference-delete btn btn-link btn-sm\"><span class=\"fa fa-trash\"></span></button>\n  </span>\n</li>\n");
      });
      this.$element.html(itemsHtml.join(''));
    }
  }]);

  return ReferenceList;
}();
/**
 * @param {ReferenceList} referenceList
 */


function initializeDropzone(referenceList) {
  var formElement = document.querySelector('.js-reference-dropzone');

  if (!formElement) {
    return;
  }

  var dropzone = new dropzone__WEBPACK_IMPORTED_MODULE_13___default.a(formElement, {
    paramName: 'reference',
    init: function init() {
      this.on('success', function (file, data) {
        referenceList.addReference(data);
      });
      this.on('error', function (file, data) {
        if (data.detail) {
          this.emit('error', file, data.detail);
        }
      });
    }
  });
}

/***/ })

},[["./assets/js/admin_article_form.js","runtime","vendors~admin_article_form~app~article_show","vendors~admin_article_form~app","vendors~admin_article_form"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanMvYWRtaW5fYXJ0aWNsZV9mb3JtLmpzIl0sIm5hbWVzIjpbIkRyb3B6b25lIiwiYXV0b0Rpc2NvdmVyIiwiJCIsImRvY3VtZW50IiwicmVhZHkiLCIkYXV0b0NvbXBsZXRlIiwiaXMiLCJ0aGVuIiwiYXV0b2NvbXBsZXRlIiwiJHJlZmVyZW5jZUxpc3QiLCJyZWZlcmVuY2VMaXN0IiwiUmVmZXJlbmNlTGlzdCIsImluaXRpYWxpemVEcm9wem9uZSIsIiRsb2NhdGlvblNlbGVjdCIsIiRzcGVjaWZpY0xvY2F0aW9uVGFyZ2V0Iiwib24iLCJlIiwiYWpheCIsInVybCIsImRhdGEiLCJsb2NhdGlvbiIsInZhbCIsInN1Y2Nlc3MiLCJodG1sIiwiZmluZCIsInJlbW92ZSIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCIkZWxlbWVudCIsInN0dWZmIiwiV2Vha1NldCIsInNvcnRhYmxlIiwiU29ydGFibGUiLCJjcmVhdGUiLCJoYW5kbGUiLCJhbmltYXRpb24iLCJvbkVuZCIsIm1ldGhvZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJ0b0FycmF5IiwicmVmZXJlbmNlcyIsInJlbmRlciIsImV2ZW50IiwiaGFuZGxlUmVmZXJlbmNlRGVsZXRlIiwiaGFuZGxlUmVmZXJlbmNlRWRpdEZpbGVuYW1lIiwicmVmZXJlbmNlIiwicHVzaCIsIiRsaSIsImN1cnJlbnRUYXJnZXQiLCJjbG9zZXN0IiwiaWQiLCJmaWx0ZXIiLCJvcmlnaW5hbEZpbGVuYW1lIiwiaXRlbXNIdG1sIiwibWFwIiwiam9pbiIsImZvcm1FbGVtZW50IiwicXVlcnlTZWxlY3RvciIsImRyb3B6b25lIiwicGFyYW1OYW1lIiwiaW5pdCIsImZpbGUiLCJhZGRSZWZlcmVuY2UiLCJkZXRhaWwiLCJlbWl0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FB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QUFJLEVBQUUsZ0JBQVc7QUFDZixXQUFLOUMsRUFBTCxDQUFRLFNBQVIsRUFBbUIsVUFBUytDLElBQVQsRUFBZTNDLElBQWYsRUFBcUI7QUFDdENULHFCQUFhLENBQUNxRCxZQUFkLENBQTJCNUMsSUFBM0I7QUFDRCxPQUZEO0FBSUEsV0FBS0osRUFBTCxDQUFRLE9BQVIsRUFBaUIsVUFBUytDLElBQVQsRUFBZTNDLElBQWYsRUFBcUI7QUFDcEMsWUFBSUEsSUFBSSxDQUFDNkMsTUFBVCxFQUFpQjtBQUNmLGVBQUtDLElBQUwsQ0FBVSxPQUFWLEVBQW1CSCxJQUFuQixFQUF5QjNDLElBQUksQ0FBQzZDLE1BQTlCO0FBQ0Q7QUFDRixPQUpEO0FBS0Q7QUFac0MsR0FBMUIsQ0FBZjtBQWNELEMiLCJmaWxlIjoiYWRtaW5fYXJ0aWNsZV9mb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBEcm9wem9uZSBmcm9tICdkcm9wem9uZSc7XG5pbXBvcnQgJ2Ryb3B6b25lL2Rpc3QvZHJvcHpvbmUuY3NzJ1xuaW1wb3J0IFNvcnRhYmxlIGZyb20gJ3NvcnRhYmxlanMnO1xuXG5Ecm9wem9uZS5hdXRvRGlzY292ZXIgPSBmYWxzZTtcblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gIGNvbnN0ICRhdXRvQ29tcGxldGUgPSAkKCcuanMtdXNlci1hdXRvY29tcGxldGUnKTtcbiAgaWYgKCEkYXV0b0NvbXBsZXRlLmlzKCc6ZGlzYWJsZWQnKSkge1xuICAgIGltcG9ydCgnLi9jb21wb25lbnRzL2FsZ29saWEtYXV0b2NvbXBsZXRlJykudGhlbigoYXV0b2NvbXBsZXRlKSA9PiB7XG4gICAgICBhdXRvY29tcGxldGUuZGVmYXVsdCgkYXV0b0NvbXBsZXRlLCAndXNlcnMnLCAnZW1haWwnKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0ICRyZWZlcmVuY2VMaXN0ID0gJCgnLmpzLXJlZmVyZW5jZS1saXN0Jyk7XG4gIGlmICgkcmVmZXJlbmNlTGlzdFswXSkge1xuICAgIHZhciByZWZlcmVuY2VMaXN0ID0gbmV3IFJlZmVyZW5jZUxpc3QoJCgnLmpzLXJlZmVyZW5jZS1saXN0JykpO1xuICAgIGluaXRpYWxpemVEcm9wem9uZShyZWZlcmVuY2VMaXN0KTtcbiAgfVxuXG4gIHZhciAkbG9jYXRpb25TZWxlY3QgPSAkKCcuanMtYXJ0aWNsZS1mb3JtLWxvY2F0aW9uJyk7XG4gIHZhciAkc3BlY2lmaWNMb2NhdGlvblRhcmdldCA9ICQoJy5qcy1zcGVjaWZpYy1sb2NhdGlvbi10YXJnZXQnKTtcblxuICAkbG9jYXRpb25TZWxlY3Qub24oJ2NoYW5nZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiAkbG9jYXRpb25TZWxlY3QuZGF0YSgnc3BlY2lmaWMtbG9jYXRpb24tdXJsJyksXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGxvY2F0aW9uOiAkbG9jYXRpb25TZWxlY3QudmFsKClcbiAgICAgIH0sXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoaHRtbCkge1xuICAgICAgICBpZiAoIWh0bWwpIHtcbiAgICAgICAgICAkc3BlY2lmaWNMb2NhdGlvblRhcmdldC5maW5kKCdzZWxlY3QnKS5yZW1vdmUoKTtcbiAgICAgICAgICAkc3BlY2lmaWNMb2NhdGlvblRhcmdldC5hZGRDbGFzcygnZC1ub25lJyk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXBsYWNlIHRoZSBjdXJyZW50IGZpZWxkIGFuZCBzaG93XG4gICAgICAgICRzcGVjaWZpY0xvY2F0aW9uVGFyZ2V0XG4gICAgICAgICAgLmh0bWwoaHRtbClcbiAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpXG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbi8vIHRvZG8gLSB1c2UgV2VicGFjayBFbmNvcmUgc28gRVM2IHN5bnRheCBpcyB0cmFuc3BpbGVkIHRvIEVTNVxuY2xhc3MgUmVmZXJlbmNlTGlzdCB7XG4gIGNvbnN0cnVjdG9yKCRlbGVtZW50KSB7XG4gICAgdmFyIHN0dWZmID0gbmV3IFdlYWtTZXQoW10pO1xuXG4gICAgdGhpcy4kZWxlbWVudCA9ICRlbGVtZW50O1xuICAgIHRoaXMuc29ydGFibGUgPSBTb3J0YWJsZS5jcmVhdGUodGhpcy4kZWxlbWVudFswXSwge1xuICAgICAgaGFuZGxlOiAnLmRyYWctaGFuZGxlJyxcbiAgICAgIGFuaW1hdGlvbjogMTUwLFxuICAgICAgb25FbmQ6ICgpID0+IHtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICB1cmw6IHRoaXMuJGVsZW1lbnQuZGF0YSgndXJsJykrJy9yZW9yZGVyJyxcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh0aGlzLnNvcnRhYmxlLnRvQXJyYXkoKSlcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5yZWZlcmVuY2VzID0gW107XG4gICAgdGhpcy5yZW5kZXIoKTtcblxuICAgIHRoaXMuJGVsZW1lbnQub24oJ2NsaWNrJywgJy5qcy1yZWZlcmVuY2UtZGVsZXRlJywgKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLmhhbmRsZVJlZmVyZW5jZURlbGV0ZShldmVudCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLiRlbGVtZW50Lm9uKCdibHVyJywgJy5qcy1lZGl0LWZpbGVuYW1lJywgKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLmhhbmRsZVJlZmVyZW5jZUVkaXRGaWxlbmFtZShldmVudCk7XG4gICAgfSk7XG5cbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiB0aGlzLiRlbGVtZW50LmRhdGEoJ3VybCcpXG4gICAgfSkudGhlbihkYXRhID0+IHtcbiAgICAgIHRoaXMucmVmZXJlbmNlcyA9IGRhdGE7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH0pXG4gIH1cblxuICBhZGRSZWZlcmVuY2UocmVmZXJlbmNlKSB7XG4gICAgdGhpcy5yZWZlcmVuY2VzLnB1c2gocmVmZXJlbmNlKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgaGFuZGxlUmVmZXJlbmNlRGVsZXRlKGV2ZW50KSB7XG4gICAgY29uc3QgJGxpID0gJChldmVudC5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KCcubGlzdC1ncm91cC1pdGVtJyk7XG4gICAgY29uc3QgaWQgPSAkbGkuZGF0YSgnaWQnKTtcbiAgICAkbGkuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiAnL2FkbWluL2FydGljbGUvcmVmZXJlbmNlcy8nK2lkLFxuICAgICAgbWV0aG9kOiAnREVMRVRFJ1xuICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5yZWZlcmVuY2VzID0gdGhpcy5yZWZlcmVuY2VzLmZpbHRlcihyZWZlcmVuY2UgPT4ge1xuICAgICAgICByZXR1cm4gcmVmZXJlbmNlLmlkICE9PSBpZDtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZVJlZmVyZW5jZUVkaXRGaWxlbmFtZShldmVudCkge1xuICAgIGNvbnN0ICRsaSA9ICQoZXZlbnQuY3VycmVudFRhcmdldCkuY2xvc2VzdCgnLmxpc3QtZ3JvdXAtaXRlbScpO1xuICAgIGNvbnN0IGlkID0gJGxpLmRhdGEoJ2lkJyk7XG4gICAgY29uc3QgcmVmZXJlbmNlID0gdGhpcy5yZWZlcmVuY2VzLmZpbmQocmVmZXJlbmNlID0+IHtcbiAgICAgIHJldHVybiByZWZlcmVuY2UuaWQgPT09IGlkO1xuICAgIH0pO1xuICAgIHJlZmVyZW5jZS5vcmlnaW5hbEZpbGVuYW1lID0gJChldmVudC5jdXJyZW50VGFyZ2V0KS52YWwoKTtcblxuICAgICQuYWpheCh7XG4gICAgICB1cmw6ICcvYWRtaW4vYXJ0aWNsZS9yZWZlcmVuY2VzLycraWQsXG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkocmVmZXJlbmNlKVxuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGl0ZW1zSHRtbCA9IHRoaXMucmVmZXJlbmNlcy5tYXAocmVmZXJlbmNlID0+IHtcbiAgICAgIHJldHVybiBgXG48bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW0gZC1mbGV4IGp1c3RpZnktY29udGVudC1iZXR3ZWVuIGFsaWduLWl0ZW1zLWNlbnRlclwiIGRhdGEtaWQ9XCIke3JlZmVyZW5jZS5pZH1cIj5cbiAgPHNwYW4gY2xhc3M9XCJkcmFnLWhhbmRsZSBmYSBmYS1yZW9yZGVyXCI+PC9zcGFuPlxuICA8aW5wdXQgdHlwZT1cInRleHRcIiB2YWx1ZT1cIiR7cmVmZXJlbmNlLm9yaWdpbmFsRmlsZW5hbWV9XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wganMtZWRpdC1maWxlbmFtZVwiIHN0eWxlPVwid2lkdGg6IGF1dG87XCI+XG5cbiAgPHNwYW4+XG4gICAgPGEgaHJlZj1cIi9hZG1pbi9hcnRpY2xlL3JlZmVyZW5jZXMvJHtyZWZlcmVuY2UuaWR9L2Rvd25sb2FkXCIgY2xhc3M9XCJidG4gYnRuLWxpbmsgYnRuLXNtXCI+PHNwYW4gY2xhc3M9XCJmYSBmYS1kb3dubG9hZFwiIHN0eWxlPVwidmVydGljYWwtYWxpZ246IG1pZGRsZVwiPjwvc3Bhbj48L2E+XG4gICAgPGJ1dHRvbiBjbGFzcz1cImpzLXJlZmVyZW5jZS1kZWxldGUgYnRuIGJ0bi1saW5rIGJ0bi1zbVwiPjxzcGFuIGNsYXNzPVwiZmEgZmEtdHJhc2hcIj48L3NwYW4+PC9idXR0b24+XG4gIDwvc3Bhbj5cbjwvbGk+XG5gXG4gICAgfSk7XG5cbiAgICB0aGlzLiRlbGVtZW50Lmh0bWwoaXRlbXNIdG1sLmpvaW4oJycpKTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7UmVmZXJlbmNlTGlzdH0gcmVmZXJlbmNlTGlzdFxuICovXG5mdW5jdGlvbiBpbml0aWFsaXplRHJvcHpvbmUocmVmZXJlbmNlTGlzdCkge1xuICB2YXIgZm9ybUVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtcmVmZXJlbmNlLWRyb3B6b25lJyk7XG4gIGlmICghZm9ybUVsZW1lbnQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgZHJvcHpvbmUgPSBuZXcgRHJvcHpvbmUoZm9ybUVsZW1lbnQsIHtcbiAgICBwYXJhbU5hbWU6ICdyZWZlcmVuY2UnLFxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5vbignc3VjY2VzcycsIGZ1bmN0aW9uKGZpbGUsIGRhdGEpIHtcbiAgICAgICAgcmVmZXJlbmNlTGlzdC5hZGRSZWZlcmVuY2UoZGF0YSk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5vbignZXJyb3InLCBmdW5jdGlvbihmaWxlLCBkYXRhKSB7XG4gICAgICAgIGlmIChkYXRhLmRldGFpbCkge1xuICAgICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBmaWxlLCBkYXRhLmRldGFpbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9