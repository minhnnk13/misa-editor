import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import Command from "@ckeditor/ckeditor5-core/src/command";
import Widget from "@ckeditor/ckeditor5-widget/src/widget";
import fileSimulateIcon from "./icon/chem.svg";

const COMMAND_NAME = "cmdUploadSimulate";
const CONFIG_NAME = "cfgUploadSimulate";
const COMPONENT_NAME = "uploadSimulate";

export default class UploadFileSimulate extends Plugin {
  static get requires() {
    return [Widget];
  }

  static get pluginName() {
    return "UploadSimulate";
  }

  init() {
    this._addCommands();

    this._addViews();

    // defined config math
    this.editor.config.define(CONFIG_NAME, {
      title: "Tải video, ảnh,..",
      inputId: "inputId",
    });
  }

  /* Add the buttons */
  _addViews() {
    const { editor } = this;
    editor.ui.componentFactory.add(COMPONENT_NAME, (locale) => {
      const view = new ButtonView(locale);
      const titleLabel = editor.config.get(CONFIG_NAME + ".title");

      view.bind("isEnabled").to(editor.commands.get(COMMAND_NAME), "isEnabled");

      view.set({
        label: titleLabel,
        icon: fileSimulateIcon,
        tooltip: true,
      });

      // Callback executed once the image is clicked.
      view.on("execute", () => {
        editor.execute(COMMAND_NAME, {
          inputId: editor.config.get(CONFIG_NAME + ".inputId"),
        });
      });

      return view;
    });
  }

  /**
   * Add the commands to the editor
   */
  _addCommands() {
    const { editor } = this;
    editor.commands.add(COMMAND_NAME, new UploadSimulateCommand(editor));
  }
}

class UploadSimulateCommand extends Command {
  execute(options = { inputId }) {
    const element = document.getElementById(options.inputId);
    if (element) {
      element.click();
    }
    console.log("clicked simulate element has id: " + options.inputId);
  }
}
