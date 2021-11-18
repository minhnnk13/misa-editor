/**
 * @license Copyright (c) 2014-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment.js';
// import AutoImage from '@ckeditor/ckeditor5-image/src/autoimage.js';
// import AutoLink from '@ckeditor/ckeditor5-link/src/autolink.js';
// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
// import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices.js';
// import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage.js';
// import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
// import FindAndReplace from '@ckeditor/ckeditor5-find-and-replace/src/findandreplace.js';
// import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor.js';
// import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily.js';
// import FontSize from '@ckeditor/ckeditor5-font/src/fontsize.js';
// import Heading from '@ckeditor/ckeditor5-heading/src/heading.js';
// import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight.js';
// import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline.js';
// import Image from '@ckeditor/ckeditor5-image/src/image.js';
// import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption.js';
// import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert.js';
// import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize.js';
// import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle.js';
// import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar.js';
// import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload.js';
// import Indent from '@ckeditor/ckeditor5-indent/src/indent.js';
// import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock.js';
// import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
// import Link from '@ckeditor/ckeditor5-link/src/link.js';
// import LinkImage from '@ckeditor/ckeditor5-link/src/linkimage.js';
// import List from '@ckeditor/ckeditor5-list/src/list.js';
// import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed.js';
// import MediaEmbedToolbar from '@ckeditor/ckeditor5-media-embed/src/mediaembedtoolbar.js';
// import PageBreak from '@ckeditor/ckeditor5-page-break/src/pagebreak.js';
// import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
// import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice.js';
// import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting.js';
// import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters.js';
// import SpecialCharactersArrows from '@ckeditor/ckeditor5-special-characters/src/specialcharactersarrows.js';
// import SpecialCharactersCurrency from '@ckeditor/ckeditor5-special-characters/src/specialcharacterscurrency.js';
// import SpecialCharactersEssentials from '@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials.js';
// import SpecialCharactersLatin from '@ckeditor/ckeditor5-special-characters/src/specialcharacterslatin.js';
// import SpecialCharactersMathematical from '@ckeditor/ckeditor5-special-characters/src/specialcharactersmathematical.js';
// import SpecialCharactersText from '@ckeditor/ckeditor5-special-characters/src/specialcharacterstext.js';
// import StandardEditingMode from '@ckeditor/ckeditor5-restricted-editing/src/standardeditingmode.js';
// import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough.js';
// import Table from '@ckeditor/ckeditor5-table/src/table.js';
// import TableCaption from '@ckeditor/ckeditor5-table/src/tablecaption.js';
// import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties';
// import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties';
// import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar.js';
// import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline.js';
// import WordCount from '@ckeditor/ckeditor5-word-count/src/wordcount.js';

import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor.js";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold.js";
import CloudServices from "@ckeditor/ckeditor5-cloud-services/src/cloudservices.js";

// tính năng easyImage sẽ ko tự hđ đúng cần thêm dòng dưới vào
// file @ckeditor/ckeditor5-cloud-services/src/uploadgateway/fileuploader.js
// ngay trên dòng return resolve( xhrResponse );
// if (xhrResponse && xhrResponse.default) {
//   xhrResponse.Default = xhrResponse.default;
// }
import EasyImage from "@ckeditor/ckeditor5-easy-image/src/easyimage.js";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials.js";
import Image from "@ckeditor/ckeditor5-image/src/image.js";
import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload.js";

import ImageResizeEditing from "@ckeditor/ckeditor5-image/src/imageresize/imageresizeediting";
import ImageResizeHandles from "@ckeditor/ckeditor5-image/src/imageresize/imageresizehandles";

import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic.js";
import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed.js";
import MediaEmbedToolbar from "@ckeditor/ckeditor5-media-embed/src/mediaembedtoolbar.js";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph.js";
import PasteFromOffice from "@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice.js";
import Strikethrough from "@ckeditor/ckeditor5-basic-styles/src/strikethrough.js";
import Table from "@ckeditor/ckeditor5-table/src/table.js";
import TableCaption from "@ckeditor/ckeditor5-table/src/tablecaption.js";
import TableCellProperties from "@ckeditor/ckeditor5-table/src/tablecellproperties";
import TableProperties from "@ckeditor/ckeditor5-table/src/tableproperties";
import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar.js";
import Underline from "@ckeditor/ckeditor5-basic-styles/src/underline.js";

import Link from "@ckeditor/ckeditor5-link/src/link";
import AutoLink from "@ckeditor/ckeditor5-link/src/autolink";

import MathTypeNNanh from "./math-type-nnanh/src/index";
import UploadSimulate from "./upload-file-simulate/src/index";
import PasteIgnoreImage from "./paste-ignore-image";

import BlankBox from "./blank-box/src/index";

import Placeholder from "./place-holder/index";

class Editor extends ClassicEditor {}

// Plugins to include in the build.
Editor.builtinPlugins = [
    Alignment,
  //   AutoImage,
  //   AutoLink,
  //   Bold,
  //   CloudServices,
  //   EasyImage,
  //   Essentials,
  //   FindAndReplace,
  //   FontColor,
  //   FontFamily,
  //   FontSize,
  //   Heading,
  //   Highlight,
  //   HorizontalLine,
  //   Image,
  //   ImageCaption,
  //   ImageInsert,
  //   ImageResize,
  //   ImageStyle,
  //   ImageToolbar,
  //   ImageUpload,
  //   Indent,
  //   IndentBlock,
  //   Italic,
  //   Link,
  //   LinkImage,
  //   List,
  //   MediaEmbed,
  //   MediaEmbedToolbar,
  //   PageBreak,
  //   Paragraph,
  //   PasteFromOffice,
  //   SourceEditing,
  //   SpecialCharacters,
  //   SpecialCharactersArrows,
  //   SpecialCharactersCurrency,
  //   SpecialCharactersEssentials,
  //   SpecialCharactersLatin,
  //   SpecialCharactersMathematical,
  //   SpecialCharactersText,
  //   StandardEditingMode,
  //   Strikethrough,
  //   Table,
  //   TableCaption,
  //   TableCellProperties,
  //   TableProperties,
  //   TableToolbar,
  //   Underline,
  //   WordCount,

  Bold,
  CloudServices,
  EasyImage,
  Essentials,
  Image,
  ImageUpload,
  ImageResizeEditing,
  ImageResizeHandles,

  Link,
  AutoLink,

  Italic,
  MediaEmbed,
  MediaEmbedToolbar,
  Paragraph,
  PasteFromOffice,
  Strikethrough,
  Table,
  TableCaption,
  TableCellProperties,
  TableProperties,
  TableToolbar,
  Underline,
  MathTypeNNanh,
  UploadSimulate,
  PasteIgnoreImage,
  BlankBox,
  Placeholder,
];

export default Editor;
