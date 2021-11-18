/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module paste-from-office/pastefromoffice
 */

import { Plugin } from "ckeditor5/src/core";
import { ClipboardPipeline } from "ckeditor5/src/clipboard";

import GoogleDocsNormalizer from "./normalizers/googledocsnormalizer";
import MSWordNormalizer from "./normalizers/mswordnormalizer";

import { parseHtml } from "./filters/parse";

/**
 * The Paste from Office plugin.
 *
 * This plugin handles content pasted from Office apps and transforms it (if necessary)
 * to a valid structure which can then be understood by the editor features.
 *
 * Transformation is made by a set of predefined {@link module:paste-from-office/normalizer~Normalizer normalizers}.
 * This plugin includes following normalizers:
 *   * {@link module:paste-from-office/normalizers/mswordnormalizer~MSWordNormalizer Microsoft Word normalizer}
 *   * {@link module:paste-from-office/normalizers/googledocsnormalizer~GoogleDocsNormalizer Google Docs normalizer}
 *
 * For more information about this feature check the {@glink api/paste-from-office package page}.
 *
 * @extends module:core/plugin~Plugin
 */
// Lớp này sẽ ignore tất cả image nếu ko phải copy từ word hay office
export default class PasteIgnoreImage extends Plugin {
  /**
   * @inheritDoc
   */
  static get pluginName() {
    return "PasteIgnoreImage";
  }

  /**
   * @inheritDoc
   */
  static get requires() {
    return [ClipboardPipeline];
  }

  /**
   * @inheritDoc
   */
  init() {
    const me = this;
    const editor = this.editor;
    const viewDocument = editor.editing.view.document;
    const normalizers = [];

    normalizers.push(new MSWordNormalizer(viewDocument));
    normalizers.push(new GoogleDocsNormalizer(viewDocument));

    editor.plugins.get("ClipboardPipeline").on(
      "inputTransformation",
      (evt, data) => {
        const htmlText = data.dataTransfer.getData("text/html");
        if (!htmlText) {
          return;
        }
        const htmlString = me.replaceImgText(htmlText);
        const activeNormalizer = normalizers.find((normalizer) =>
          normalizer.isActive(htmlString)
        );
        if (!activeNormalizer && htmlString) {
          data._parsedData = parseHtml(
            htmlString,
            viewDocument.stylesProcessor
          );
          const { body: documentFragment } = data._parsedData;
          data.content = documentFragment;
        }
      },
      { priority: "high" }
    );
  }
  /**
   * Cắt bỏ hết image trong html
   * @param {*} html
   * @returns
   */
  replaceImgText(html) {
    const htmlNode = document.createElement("html");
    htmlNode.innerHTML = html;
    const imgs = htmlNode.querySelectorAll("img");
    for (let i = 0; i < imgs.length; i++) {
      imgs[i].remove();
    }
    return htmlNode.innerHTML;
  }
}
