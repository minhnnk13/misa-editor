import { mathClassName, mathAttributeName, mathComponentName } from "./config";

import MathQuill from "./lib/mathquill.min";

const modalDialogContainer = "nnanh_modal_dialogContainer";

/**
 * @typedef {Object} DeviceProperties
 * @property {String} DeviceProperties.orientation - Indicates of the orientation of the device.
 * @property {Boolean} DeviceProperties.isAndroid - True if the device is Android. False otherwise.
 * @property {Boolean} DeviceProperties.isIOS - True if the device is iOS. False otherwise.
 * @property {Boolean} DeviceProperties.isMobile - True if the device is a mobile one.
 * False otherwise.
 * @property {Boolean} DeviceProperties.isDesktop - True if the device is a desktop one.
 * False otherwise.
 */
export default class ModalDialog {
  /**
   * @classdesc
   * This class represents a modal dialog. The modal dialog admits
   * a {@link ContentManager} instance to manage the content of the dialog.
   * @constructs
   * @param {Object} modalDialogAttributes  - An object containing all modal dialog attributes.
   */
  constructor(editor) {
    const me = this;
    me.editor = editor;
    me.createdContainer = false;
  }

  /**
   * This method opens the modal window, restoring the previous state, position and metrics,
   * if exists. By default the modal object opens in stack mode.
   */
  open() {
    const me = this;
    if (me.createdContainer) {
      me.container.style.display = "block";
    } else {
      me.create();
    }
    me.mathField.latex(me.getLatexSelection());
    me.mathField.focus();
  }

  getLatexSelection() {
    const { editor } = this;
    const selectElement =
      editor.editing.view.document.selection.getSelectedElement();
    if (
      selectElement &&
      selectElement.name == "span" &&
      selectElement.getAttribute("class").includes(mathClassName)
    ) {
      return selectElement.getChild(0).getAttribute(mathAttributeName);
    }
    return "";
  }

  /**
   * Tạo 1 màn modal
   */
  create() {
    const me = this;

    // Obtain number of current instance.
    me.instanceId =
      document.getElementsByClassName(modalDialogContainer).length;

    const container = document.createElement("div");
    container.setAttribute("class", modalDialogContainer);
    container.setAttribute("id", me.getElementId(modalDialogContainer));

    me.container = container;

    const titleBarCls = "wrs_modal_title_bar";
    const titleBarId = me.getElementId(titleBarCls);
    const titleCls = "wrs_modal_title";
    const titleId = me.getElementId(titleCls);
    const controlsCls = "wrs_modal_controls";
    const controlsId = me.getElementId(controlsCls);
    const buttonContainerCls = "wrs_modal_buttons_container";
    const buttonContainerId = me.getElementId(buttonContainerCls);
    const submitButtonCls = "wrs_modal_button_accept";
    const submitButtonId = me.getElementId(submitButtonCls);
    const cancelButtonCls = "wrs_modal_button_cancel";
    const cancelButtonId = me.getElementId(cancelButtonCls);

    const mathFieldCls = "math_field";
    const mathFieldId = me.getElementId(mathFieldCls);

    const mathToolbarCls = "math-nnanh-toolbar";

    container.insertAdjacentHTML(
      "beforeend",
      `<div class="${titleBarCls} wrs_modal_desktop wrs_stack header" id="${titleBarId}">
          <div class="${titleCls}" id="${titleId}">
            Chèn công thức
          </div>
          <div class="wrs_bottom_left_resizer"></div>
      </div>`
    );
    container.insertAdjacentHTML(
      "beforeend",
      `<div class="content">
        <div class="${mathToolbarCls}"></div>
        <div id="${mathFieldId}" class="${mathFieldCls}"></div>
      </div>`
    );

    container.insertAdjacentHTML(
      "beforeend",
      `<div class="${controlsCls} footer" id="${controlsId}">
        <div class="${buttonContainerCls}" id="${buttonContainerId}">
          <button id="${cancelButtonId}" class="${cancelButtonCls}">Đóng</button>
          <button id="${submitButtonId}" class="${submitButtonCls}">Chèn</button>
        </div>
      </div>`
    );

    me.createToolbar(container.querySelector("." + mathToolbarCls));

    document.body.appendChild(container);

    var mathFieldSpan = me.getElementById(mathFieldId, container);
    var MQ = MathQuill.getInterface(2);
    var mathField = MQ.MathField(mathFieldSpan, {
      spaceBehavesLikeTab: true, // configurable
    });
    me.mathField = mathField;

    const btnSubmit = me.getElementById(submitButtonId, container);
    me.submitButton = btnSubmit;
    btnSubmit.addEventListener("click", me.submitAction.bind(me, mathField));

    const cancelBtn = me.getElementById(cancelButtonId, container);
    me.cancelButton = cancelBtn;
    cancelBtn.addEventListener("click", me.cancelAction.bind(me));

    me.createdContainer = true;
  }

  createToolbar(toolbarElement) {
    const me = this;
    const { editor } = me;
    function clickItemToolbar(event) {
      const dataLatex = event.currentTarget.getAttribute("data-write");
      me.mathField.cmd(dataLatex);
      me.mathField.focus();
    }
    let listItemToolbar = editor.config.get("nnanhMathType.itemsToolbar");
    if (listItemToolbar && Array.isArray(listItemToolbar)) {
      listItemToolbar.forEach((itemToolbar, index) => {
        const spanToolbarItem = document.createElement("span");
        spanToolbarItem.setAttribute("class", "math-nnanh-btn");
        spanToolbarItem.setAttribute("data-write", itemToolbar.dataWrite);
        spanToolbarItem.setAttribute("title", itemToolbar.title);

        spanToolbarItem.addEventListener("click", clickItemToolbar.bind(me));
        const imageToolbar = document.createElement("img");
        imageToolbar.src = itemToolbar.imgUri;
        spanToolbarItem.appendChild(imageToolbar);
        toolbarElement.appendChild(spanToolbarItem);
      });
    }
  }

  /**
   * This method is called when the modal object has been submitted. Calls
   * contentElement submitAction method - if exists - and closes the modal
   * object. No logic about the content should be placed here,
   * contentElement.submitAction is the responsible of the content logic.
   */
  submitAction(mathField, event) {
    const { editor } = this;
    let mathml = mathField.latex();
    // This returns the value returned by the callback function (writer => {...})
    if (mathml == null || mathml == "" || mathml == undefined) {
    } else {
      mathml = mathml.replaceAll('frac', 'dfrac')
      editor.model.change((writer) => {
        const options = {};
        options[mathAttributeName] = mathml;
        const modelElementNew = writer.createElement(
          mathComponentName,
          options
        );
        modelElementNew.data = mathml;

        const viewSelection =
          editor.selection || editor.editing.view.document.selection;
        const modelPosition = editor.editing.mapper.toModelPosition(
          viewSelection.getLastPosition()
        );

        const latextSelection = this.getLatexSelection();
        if (latextSelection) {
          const viewElement =
            editor.editing.view.document.selection.getSelectedElement();
          if (viewElement) {
            const modelElOld =
              editor.editing.mapper.toModelElement(viewElement);
            const position = editor.model.createPositionBefore(modelElOld);
            writer.insert(modelElementNew, modelPosition);
            writer.remove(modelElOld);
          }
        } else {
          writer.insert(modelElementNew, modelPosition);
        }
        return modelElementNew;
      });
    }

    this.close();
    editor.editing.view.focus();
  }

  cancelAction() {
    this.close();
  }

  close() {
    const me = this;
    me.container.style.display = "none";
    me.mathField.latex("");
  }

  getElementById(id, selector) {
    if (selector == null) {
      selector = document;
    }
    return selector.querySelector("#" + id);
  }

  /**
   * Returns the id of an element, adding the instance number to
   * the element class name:
   * className --> className[idNumber]
   * @param {String} className - The element class name.
   * @returns {String} A string appending the instance id to the className.
   */
  getElementId(className) {
    return `${className}_${this.instanceId}`;
  }
}
