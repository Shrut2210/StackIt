import React, { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Smile,
  Code,
} from "lucide-react";

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Write your content...",
  className = "",
}) => {
  const editorRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojis = ["😊", "😂", "😍", "🤔", "👍", "👎", "❤️", "🎉", "🔥", "💯"];

  const execCommand = (command, value) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertEmoji = (emoji) => {
    execCommand("insertText", emoji);
    setShowEmojiPicker(false);
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      execCommand("insertImage", url);
    }
  };
  const formatCodeBlock = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (selectedText) {
      const code = document.createElement("code");
      code.textContent = selectedText;
      range.deleteContents();
      range.insertNode(code);
    } else {
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.textContent = "// your code here";
      pre.appendChild(code);
      range.insertNode(pre);
    }

    // move cursor after inserted node
    selection.collapseToEnd();

    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const toolbarButtons = [
    { icon: Bold, command: "bold", title: "Bold" },
    { icon: Italic, command: "italic", title: "Italic" },
    { icon: Strikethrough, command: "strikeThrough", title: "Strikethrough" },
    { icon: List, command: "insertUnorderedList", title: "Bullet List" },
    { icon: ListOrdered, command: "insertOrderedList", title: "Numbered List" },
    { icon: AlignLeft, command: "justifyLeft", title: "Align Left" },
    { icon: AlignCenter, command: "justifyCenter", title: "Align Center" },
    { icon: AlignRight, command: "justifyRight", title: "Align Right" },
  ];

  return (
    <div
      className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            onClick={() => execCommand(button.command)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            title={button.title}
          >
            <button.icon className="w-4 h-4" />
          </button>
        ))}

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={insertLink}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
          title="Insert Link"
        >
          <Link className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={insertImage}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
          title="Insert Image"
        >
          <Image className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => formatCodeBlock()}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
          title="Insert Code Block"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            title="Insert Emoji"
          >
            <Smile className="w-4 h-4" />
          </button>

          {showEmojiPicker && (
            <div className="absolute left-0 mt-1 p-2 w-[150px] bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="grid grid-cols-5 gap-1">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => insertEmoji(emoji)}
                    className="p-1 hover:bg-gray-100 rounded text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-32 p-4 focus:outline-none"
        style={{ minHeight: "128px" }}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contenteditable]:empty::before {
          content: attr(data-placeholder);
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
