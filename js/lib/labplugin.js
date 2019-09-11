var uploader_widget = require('./index');
var base = require('@jupyter-widgets/base');

module.exports = {
  id: 'uploader_widget',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'uploader_widget',
          version: uploader_widget.version,
          exports: uploader_widget
      });
  },
  autoStart: true
};

