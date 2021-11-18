import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import {
  toWidget,
  viewToModelPositionOutsideModelElement,
} from "@ckeditor/ckeditor5-widget/src/utils";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import ClickObserver from "@ckeditor/ckeditor5-engine/src/view/observer/clickobserver";
import Widget from "@ckeditor/ckeditor5-widget/src/widget";
import mathIcon from "../theme/icons/formula.svg";
import MathTypeCommand from "./command-custom";
import ModalDialog from "./modal-custom.js";

// import MathJax from "../../mathjax/tex-svg-full";

import {
  mathClassName,
  mathComponentName,
  mathAttributeName,
  mathConfigName,
  mathCommandName,
  listItemToolbar,
  libLoadScript,
} from "./config";
import "../styles/index.css";

export default class MathTypeNNanh extends Plugin {
  static get requires() {
    return [Widget];
  }

  static get pluginName() {
    return "MathTypeNNAnh";
  }

  init() {
    this._initDialog();

    this._addCommands();

    this._addViews();

    this._addSchema();

    this._addConverters();

    // Expose the WirisPlugin variable to the window
    // this._exposeVariableToWindow();

    this.editor.config.define(mathConfigName, {
      itemsToolbar: listItemToolbar,
      libScript: libLoadScript,
      titleLabel: "Chèn công thức toán học",
    });
  }

  _initDialog() {
    const me = this;
    const { editor } = me;
    this.modalDialog = new ModalDialog(editor);
    me.listenTo(
      me.editor.editing.view.document,
      "click",
      (evt, data) => {
        // Is double click
        if (data.domEvent.detail === 2) {
          me.doubleClickHandler(data.domTarget, data.domEvent);
          evt.stop();
        }
      },
      { priority: "highest" }
    );
  }

  doubleClickHandler(element, event) {
    const { editor } = this;
    if (editor.isReadOnly === false) {
      const parentEl = element.parentElement;
      if (element.nodeName.toLowerCase() === "img" && parentEl) {
        if (
          parentEl.nodeName.toLowerCase() === "span" &&
          parentEl.classList.contains(mathClassName)
        ) {
          editor.execute(mathCommandName, { dialog: this.modalDialog });
        }
      }
    }
  }

  /**
   * Add the buttons for MathType and ChemType
   */
  _addViews() {
    const { editor } = this;
    editor.ui.componentFactory.add("mathTypeNNAnh", (locale) => {
      const view = new ButtonView(locale);
      let titleLabel = editor.config.get("nnanhMathType.titleLabel");

      view
        .bind("isEnabled")
        .to(editor.commands.get(mathCommandName), "isEnabled");

      view.set({
        label: titleLabel,
        icon: mathIcon,
        tooltip: true,
      });

      // Callback executed once the image is clicked.
      view.on("execute", () => {
        editor.execute(mathCommandName, { dialog: this.modalDialog });
      });

      return view;
    });
    // Observer for the double click event
    // ko tự nhiên bấm nút dbclick nó ăn đâu
    // phải có observer nữa nhưng cái này có ở math-nnanh rồi nên ko cần nữa cmt lại
    editor.editing.view.addObserver(ClickObserver);
  }

  /**
   * Add the MathType and ChemType commands to the editor
   */
  _addCommands() {
    const { editor } = this;

    editor.commands.add(mathCommandName, new MathTypeCommand(editor));

    editor.editing.mapper.on(
      "viewToModelPosition",
      viewToModelPositionOutsideModelElement(editor.model, (viewElement) =>
        viewElement.hasClass(mathClassName)
      )
    );
  }

  /* Registers the <mathml> element in the schema */
  _addSchema() {
    const { schema } = this.editor.model;

    schema.register(mathComponentName, {
      allowWhere: "$text",
      isInline: true,
      isObject: true,
      allowAttributesOf: "$text",
      allowAttributes: [mathAttributeName],
    });
  }

  _addConverters() {
    const { conversion } = this.editor;
    conversion.for("upcast").elementToElement({
      view: {
        name: "span",
        classes: [mathClassName],
      },
      model: (viewElement, { writer: modelWriter }) => {
        const latex = viewElement.getAttribute(mathAttributeName);
        const options = {};
        options[mathAttributeName] = latex;
        const modelElementNew = modelWriter.createElement(
          mathComponentName,
          options
        );
        modelElementNew.data = latex;
        return modelElementNew;
      },
    });

    conversion.for("editingDowncast").elementToElement({
      model: mathComponentName,
      view: createViewWidget,
    });

    conversion.for("dataDowncast").elementToElement({
      model: mathComponentName,
      view: createDataString,
    });

    // Helper method for both downcast converters.
    function createViewWidget(modelItem, { writer: viewWriter }) {
      const containerElement = viewWriter.createContainerElement("span", {
        class: mathClassName,
      });
      var latexNNanh = modelItem.getAttribute(mathAttributeName);
      // const options = {
      //   class: mathClassName,
      //   style: "width:0; height: 0",
      //   scrolling: "no",
      //   frameborder: "0",
      //   onload: "MisaMathCustom.onloadIframe(event)",
      // };
      // options[mathAttributeName] = latexNNanh;
      // const iframeElement = viewWriter.createContainerElement(
      //   "iframe",
      //   options
      // );
      // const imgElement = viewWriter.createEmptyElement("img", {
      //   style:
      //     "position: absolute; z-index: 100; top:50%; left:50%; transform: translate(-50%, -50%)",
      //   src: "data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==",
      // });
      // viewWriter.insert(
      //   viewWriter.createPositionAt(containerElement, 0),
      //   iframeElement
      // );

      // Chuyển sang sử dụng mathJax để hiển thị ảnh
      // lệnh dưới sinh ra thẻ svg là con của thẻ mathJaxEl
      // lấy các thông tin width, height, vertical-align trong svg ra
      // phải sử dụng thư viện mathJax mới ko lỗi nếu ko sẽ lỗi ứng dụng
      const mathJaxEl = MathJax.tex2svg(latexNNanh);
      const svgEl = mathJaxEl.children[0];
      let style = "width: " + svgEl.width.baseVal.valueAsString;
      style += "; height: " + svgEl.height.baseVal.valueAsString;
      style += "; vertical-align: " + svgEl.style.verticalAlign;
      const optionsSvg = {
        style: style,
        src: "data:image/svg+xml;charset=utf8," + escape(svgEl.outerHTML),
      };
      optionsSvg[mathAttributeName] = latexNNanh;
      const imgElement = viewWriter.createEmptyElement("img", optionsSvg);

      viewWriter.insert(
        viewWriter.createPositionAt(containerElement, 0),
        imgElement
      );

      return toWidget(containerElement, viewWriter);
    }

    function createDataString(modelItem, { writer: viewWriter }) {
      const attributeValue = modelItem.getAttribute(mathAttributeName);
      const latexMathJax = "\\(" + attributeValue + "\\)";
      const options = {
        class: mathClassName,
      };
      options[mathAttributeName] = attributeValue;

      const widgetElement = viewWriter.createContainerElement("span", options);
      const text = viewWriter.createText(latexMathJax);

      viewWriter.insert(viewWriter.createPositionAt(widgetElement, 0), text);

      return widgetElement;
    }
  }

  // _exposeVariableToWindow() {
  //   const { editor } = this;
  //   let libScript = editor.config.get("nnanhMathType.libScript");
  //   window.MisaMathCustom = {
  //     libScript: libScript,
  //     onloadIframe: function (e) {
  //       const me = this;
  //       function loadScript(src, callback) {
  //         let r = false;
  //         const s = document.createElement("script");
  //         s.type = "text/javascript";
  //         s.src = src;
  //         s.onload = s.onreadystatechange = function () {
  //           if (!r && (!this.readyState || this.readyState == "complete")) {
  //             r = true;
  //             if (typeof callback == "function") {
  //               callback();
  //             }
  //           }
  //         };
  //         iframe.contentDocument.body.appendChild(s);
  //       }
  //       const iframe = e.target;
  //       const documentIf = e.target.contentDocument;
  //       const { styleCss, mathScript, jqScript } = me.libScript;

  //       documentIf.body.style.margin = "0";
  //       documentIf.head.insertAdjacentHTML(
  //         "beforeend",
  //         `<link rel="stylesheet" href=${styleCss}>`
  //       );
  //       documentIf.body.insertAdjacentHTML(
  //         "beforeend",
  //         `<span id="latex">${decodeURIComponent(
  //           iframe.getAttribute(mathAttributeName)
  //         )}</span>`
  //       );

  //       const elementLatex = documentIf.body.querySelector("#latex");

  //       function loadJqLibCallback() {
  //         loadScript(mathScript, function () {
  //           var mathField = MathQuill.getInterface(2).StaticMath(elementLatex);
  //           // Khi el latex thay đổi size
  //           const elLatexChange = function () {
  //             const widthStyle = elementLatex.offsetWidth + "px";
  //             const heightStyle = elementLatex.offsetHeight + "px";

  //             // const widthStyle = "2.127ex";
  //             // const heightStyle = "4.588ex";
  //             iframe.style.width = widthStyle;
  //             iframe.style.height = heightStyle;
  //             iframe.style["vertical-align"] = "middle";
  //             if (iframe.nextSibling.nodeName == "IMG") {
  //               iframe.nextSibling.style.width = widthStyle;
  //               iframe.nextSibling.style.height = heightStyle;
  //             }
  //           };
  //           new ResizeObserver(elLatexChange).observe(elementLatex);

  //           // Khi el body thay đổi size
  //           new ResizeObserver(function () {
  //             const latexMath = iframe.getAttribute(mathAttributeName);
  //             mathField.latex(decodeURIComponent(latexMath));
  //             elLatexChange();
  //           }).observe(documentIf.body);
  //         });
  //       }

  //       loadScript(jqScript, loadJqLibCallback);
  //     },
  //   };
  //   editor.on("ready", () => {});
  // }
}
