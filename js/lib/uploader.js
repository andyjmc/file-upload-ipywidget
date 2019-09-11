var cs = require('./css/style.css');
var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');

// Custom Model. Custom widgets models must at least provide default values
// for model attributes, including
//
//  - `_view_name`
//  - `_view_module`
//  - `_view_module_version`
//
//  - `_model_name`
//  - `_model_module`
//  - `_model_module_version`
//
//  when different from the base class.

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.
var UploaderModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
        _model_name : 'UploaderModel',
        _view_name : 'UploaderView',
        _model_module : 'uploader_widget',
        _view_module : 'uploader_widget',
        _model_module_version : '0.0.1',
        _view_module_version : '0.0.1',
    })
});

// Custom View. Renders the widget model.
var UploaderView = widgets.DOMWidgetView.extend({
    className: "uploader-widget",
    events: {
        dragenter: "onDragEnter",
        dragleave: "onDragLeave",
        drop: "onDrop",
        "change input": "onChangeInput"
    },

    render: function() {
        this.$label = $("<div/>", {"class": "uploader-label"})
            .appendTo(this.$el);

        this.$fileField = $("<input/>", {type: "file"})
            .appendTo(this.$el);

        this.model.on('change:next_blob', this.uploadSlice, this);
        this.model.on('change:disabled', this.toggleDisabled, this);
        this.update();
    },
    toggleDisabled: function(){
        if(this.model.get("disabled")==true) {
            this.$fileField[0].setAttribute("disabled", "true");
            this.$label[0].parentElement.style.opacity = "0.3";
        } else {
            this.$fileField[0].removeAttribute("disabled");
            this.$label[0].parentElement.style.opacity = "0.6";
        }

    },
    onChangeInput: function(){
        this.uploadFile(this.$fileField[0].files[0]);
    },
    setFile: function(file){
        var reader  = new FileReader();

        reader.addEventListener("load", _.bind(function(){
            this.model.set("base64_data", reader.result);
            this.touch();
        }, this), false);

        reader.readAsDataURL(file);
    },
    uploadFile: function(file){
        this.model.set("file", file);
        var file = this.model.get("file");
        var extension = file.name.match(/\.[0-9a-z]+$/i)[0];
        this.model.set('new_file', true);
        this.model.set('file_type', extension);
        this.model.set('file_name', file.name);
        this.model.set('file_size', file.size);
        this.model.set("next_blob", 0);
        this.uploadSlice();
    },
    uploadSlice: function(){
        var reader = new FileReader();
        var start = this.model.get('next_blob');
        var slice_size = 1000 * 1024;
        var next_slice = start + slice_size + 1;
        var file = this.model.get("file")
        var blob = file.slice(start, next_slice);

        reader.addEventListener("load", _.bind(function(){
            this.model.set("base64_data_blob", reader.result);
            this.touch();
        }, this), false);

        this.model.set('next_slice', next_slice);
        reader.readAsDataURL(blob);
    },
    update: function() {
        this.$label.html(this.model.get("label"));
    },
    onDragEnter: function(evt){ this.$el.addClass("uploader-dragged");},
    onDragLeave: function(evt){ this.$el.removeClass("uploader-dragged");},
    onDrop: function(evt){
        evt.preventDefault();
        evt.stopImmediatePropagation();
        this.$el.removeClass("uploader-dragged");
        this.uploadFile(evt.dataTransfer.files[0]);
    }
});

module.exports = {
    UploaderModel : UploaderModel,
    UploaderView : UploaderView
};
