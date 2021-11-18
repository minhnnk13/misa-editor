/* eslint-disable max-classes-per-file */
import Command from "@ckeditor/ckeditor5-core/src/command";
import ModalDialog from "./modal-custom.js";

/**
 * Command for opening the MathType editor
 */
export default class MathTypeCommand extends Command {
  execute(options = {}) {
    this.dialog = options.dialog;
    // Open the editor
    this.openEditor();
  }

  /**
   * Checks whether we are editing an existing formula or a new one and opens the editor.
   */
  openEditor() {
    this.dialog.open();
  }
}
