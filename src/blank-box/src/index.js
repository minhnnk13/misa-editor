import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import {
  toWidget,
  toWidgetEditable,
} from "@ckeditor/ckeditor5-widget/src/utils";
import Widget from "@ckeditor/ckeditor5-widget/src/widget";
import Command from "@ckeditor/ckeditor5-core/src/command";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import { WidgetResize } from "ckeditor5/src/widget";

import { v4 as uuidv4 } from "uuid";
import "./style/index.css";
import closeIcon from "./svg/close.svg";

const COMPONENT_NAME = "blankBox";
const COMMAND_NAME = "addBlankBox";
const SCHEMA_BLANK_NAME = "blankBox";
const CLS_SCHEMA_BLANK = "blank-box";
const SCHEMA_BLANK_ITEM_NAME = "blankBoxItem";
const CLS_BLANK_ITEM_NAME = "blank-box-item";
const SCHEMA_BLANK_EDIT_NAME = "blankBoxEdit";
const CLS_BLANK_EDIT_NAME = "blank-box-edit";

const CLS_BLANK_ITEM_CLOSE = "blank-item-close";

const ATTRIBUTE_BLANK_ITEM_DATA_ID = "data-id";

const ATTRIBUTE_BLANK_ITEM_DATA_TEXT = "data-text";

class BlankBox extends Plugin {
  static get requires() {
    return [BlankBoxUI, BlankBoxItemEditing, BlankBoxKeyboard];
  }
}

/**
 * Xử lý sự kiện bấm enter
 */
class BlankBoxKeyboard extends Plugin {
  init() {
    // Handle Tab key navigation.
    this.editor.keystrokes.set("Enter", this.getEnterHandler(), {
      priority: "low",
    });
  }

  getEnterHandler() {
    const editor = this.editor;
    return (keyEvtData, cancel) => {
      if (
        keyEvtData.domTarget.classList.contains(CLS_BLANK_EDIT_NAME) &&
        keyEvtData.domTarget.innerText
      ) {
        const blankEditId = generateBlankEditId();
        editor.model.change((writer) => {
          const viewElement =
            editor.editing.view.document.selection.editableElement;
          const modelBlankEdit =
            editor.editing.mapper.toModelElement(viewElement);
          const firstChildElement = viewElement.getChild(0);
          const textData = firstChildElement._textData.trim();

          const modelBlankItem = writer.createElement(SCHEMA_BLANK_ITEM_NAME, {
            "data-text": textData,
          });

          const modelBlankEditNew = writer.createElement(
            SCHEMA_BLANK_EDIT_NAME,
            initConfigBlankEdit(blankEditId)
          );

          writer.insert(modelBlankItem, modelBlankEdit, "before");
          writer.insert(modelBlankEditNew, modelBlankEdit, "after");
          writer.remove(modelBlankEdit);

          return modelBlankItem;
        });
        focusBlankEditById(blankEditId);
      }

      cancel();
    };
  }
}

class BlankBoxUI extends Plugin {
  init() {
    console.log("BlankBoxUI#init() got called");
    const { editor } = this;
    const t = editor.t;

    editor.ui.componentFactory.add(COMPONENT_NAME, (locale) => {
      const buttonView = new ButtonView(locale);
      buttonView.set({
        label: "Tạo ô trống",
        withText: true,
        tooltip: true,
      });

      // The state of the button will be bound to the widget command.
      const command = editor.commands.get(COMMAND_NAME);
      // Bind the state of the button to the command.
      buttonView.bind("isOn", "isEnabled").to(command, "value", "isEnabled");

      // Execute the command when the button is clicked (executed).
      this.listenTo(buttonView, "execute", () => editor.execute(COMMAND_NAME));

      return buttonView;
    });
  }
}

class BlankBoxItemEditing extends Plugin {
  static get requires() {
    return [Widget, WidgetResize];
  }

  init() {
    const me = this;
    console.log("BlankBoxItemEditing#init() got called");

    me._defineSchema();
    me._defineConverters();

    me.editor.commands.add(COMMAND_NAME, new InsertBlankBoxCommand(me.editor));

    me.listenTo(
      me.editor.editing.view.document,
      "click",
      (evt, data) => {
        me._clickHandler(data.domTarget, data.domEvent);
        evt.stop();
      },
      { priority: "low" }
    );
  }

  /**
   * Xử lý xóa item
   * @param {*} element
   * @param {*} event
   */
  _clickHandler(element, event) {
    const { editor } = this;
    if (editor.isReadOnly === false) {
      if (
        element.nodeName.toLowerCase() === "img" &&
        element.classList.contains(CLS_BLANK_ITEM_CLOSE)
      ) {
        editor.model.change((writer) => {
          const viewElement =
            editor.editing.view.document.selection.getSelectedElement();
          const modelElOld = editor.editing.mapper.toModelElement(viewElement);
          writer.remove(modelElOld);
        });
      }
    }
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register(SCHEMA_BLANK_NAME, {
      // Allow wherever text is allowed:
      allowWhere: "$text",

      // The placeholder will act as an inline node:
      isInline: true,

      // The inline widget is self-contained so it cannot be split by the caret and it can be selected:
      isObject: true,

      // The inline widget can have the same attributes as text (for example linkHref, bold).
      allowAttributesOf: "$text",

      // Allow content which is allowed in blocks (i.e. text with attributes).
      allowContentOf: "$block",

      allowAttributes: [ATTRIBUTE_BLANK_ITEM_DATA_ID],
    });

    schema.register(SCHEMA_BLANK_EDIT_NAME, {
      // Cannot be split or left by the caret.
      isLimit: true,

      allowIn: SCHEMA_BLANK_NAME,

      // Allow content which is allowed in blocks (i.e. text with attributes).
      allowContentOf: "$block",

      allowAttributes: [ATTRIBUTE_BLANK_ITEM_DATA_ID],
    });

    schema.register(SCHEMA_BLANK_ITEM_NAME, {
      // Allow wherever text is allowed:
      allowWhere: "$text",

      // The placeholder will act as an inline node:
      isInline: true,

      // The inline widget is self-contained so it cannot be split by the caret and it can be selected:
      isObject: true,

      // Allow content which is allowed in blocks (i.e. text with attributes).
      allowContentOf: "$block",

      // The inline widget can have the same attributes as text (for example linkHref, bold).
      allowAttributesOf: "$text",

      allowAttributes: [ATTRIBUTE_BLANK_ITEM_DATA_TEXT],
    });
  }

  _defineConverters() {
    const editor = this.editor;
    const conversion = editor.conversion;

    conversion.for("upcast").elementToElement({
      view: {
        name: "span",
        classes: [CLS_SCHEMA_BLANK],
      },
      model: (viewElement, { writer: modelWriter }) => {
        const data = viewElement.getAttribute("data-correct");
        const blankBox = modelWriter.createElement(SCHEMA_BLANK_NAME);
        const blankBoxEdit = modelWriter.createElement(SCHEMA_BLANK_EDIT_NAME);
        let arrayCorrect = [];
        if (data) {
          arrayCorrect = JSON.parse(data);
          for (let i = 0; i < arrayCorrect.length; i++) {
            if (arrayCorrect[i]) {
              const blankBoxItem = modelWriter.createElement(
                SCHEMA_BLANK_ITEM_NAME,
                {
                  "data-text": arrayCorrect[i],
                }
              );
              modelWriter.append(blankBoxItem, blankBox);
            }
          }
        }

        modelWriter.append(blankBoxEdit, blankBox);

        return blankBox;
      },
    });

    conversion.for("dataDowncast").elementToElement({
      model: SCHEMA_BLANK_NAME,
      view: (modelElement, { writer: viewWriter }) => {
        const dataCorrect = [];
        let widthInput = "40px";
        for (const blankBoxItem of modelElement.getChildren()) {
          if (blankBoxItem.name == SCHEMA_BLANK_ITEM_NAME) {
            const textData = blankBoxItem.getAttribute(
              ATTRIBUTE_BLANK_ITEM_DATA_TEXT
            );
            dataCorrect.push(textData);
          }
        }
        if (dataCorrect.length == 0) {
          return viewWriter.createContainerElement("span");
        }

        const widgetElement = viewWriter.createContainerElement("span", {
          class: CLS_SCHEMA_BLANK,
          "data-id": modelElement.getAttribute(ATTRIBUTE_BLANK_ITEM_DATA_ID),
          "data-correct": JSON.stringify(dataCorrect),
          style: `width: ${widthInput}`,
        });
        return widgetElement;
      },
    });

    conversion.for("editingDowncast").elementToElement({
      model: SCHEMA_BLANK_NAME,
      view: (modelElement, { writer: viewWriter }) => {
        const section = viewWriter.createContainerElement("span", {
          class: CLS_SCHEMA_BLANK,
        });
        return toWidget(section, viewWriter);
      },
    });

    conversion.for("dataDowncast").elementToElement({
      model: SCHEMA_BLANK_EDIT_NAME,
      view: (modelElement, { writer: viewWriter }) => {
        return viewWriter.createContainerElement("span");
      },
    });

    conversion.for("editingDowncast").elementToElement({
      model: SCHEMA_BLANK_EDIT_NAME,
      view: (modelElement, { writer: viewWriter }) => {
        // Note: You use a more specialized createEditableElement() method here.
        const dataId = modelElement.getAttribute(ATTRIBUTE_BLANK_ITEM_DATA_ID);

        const config = initConfigBlankEdit(dataId);
        config["class"] = CLS_BLANK_EDIT_NAME;
        const element = viewWriter.createEditableElement("span", config);

        return toWidgetEditable(element, viewWriter);
      },
    });

    conversion.for("dataDowncast").elementToElement({
      model: SCHEMA_BLANK_ITEM_NAME,
      view: (modelElement, { writer: viewWriter }) => {
        return viewWriter.createContainerElement("span");
      },
    });

    conversion.for("editingDowncast").elementToElement({
      model: SCHEMA_BLANK_ITEM_NAME,
      view: (modelElement, { writer: viewWriter }) => {
        const placeholderView = viewWriter.createContainerElement("span", {
          class: CLS_BLANK_ITEM_NAME,
        });

        const innerText = viewWriter.createText(
          modelElement.getAttribute(ATTRIBUTE_BLANK_ITEM_DATA_TEXT)
        );

        const closeButton = viewWriter.createContainerElement("img", {
          class: CLS_BLANK_ITEM_CLOSE,
          src: "data:image/svg+xml;charset=utf8," + escape(closeIcon),
        });

        const position = viewWriter.createPositionAt(placeholderView, 0);
        viewWriter.insert(position, closeButton);
        viewWriter.insert(position, innerText);

        return toWidget(placeholderView, viewWriter);
      },
    });
  }
}

class InsertBlankBoxCommand extends Command {
  execute() {
    const editorModel = this.editor.model;
    const blankEditId = generateBlankEditId();
    editorModel.change((writer) => {
      editorModel.insertContent(createBlankBox(writer, blankEditId));
    });
    focusBlankEditById(blankEditId);
  }
}

function generateBlankEditId() {
  return "blankBoxEdit_" + uuidv4();
}
function focusBlankEditById(dataId) {
  const selector = `span[${ATTRIBUTE_BLANK_ITEM_DATA_ID}="${dataId}"]`;
  setTimeout(() => {
    document.querySelector(selector).focus();
  });
}
function initConfigBlankEdit(dataId) {
  const config = {};
  config[ATTRIBUTE_BLANK_ITEM_DATA_ID] = dataId;

  return config;
}

function createBlankBox(writer, newId) {
  const blankBox = writer.createElement(SCHEMA_BLANK_NAME, {
    "data-id": uuidv4(),
  });
  const blankBoxEdit = writer.createElement(
    SCHEMA_BLANK_EDIT_NAME,
    initConfigBlankEdit(newId)
  );
  writer.append(blankBoxEdit, blankBox);
  return blankBox;
}

export default BlankBox;
