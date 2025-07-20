// src/extensions/CustomHighlight.js
import { Mark, mergeAttributes } from "@tiptap/core";

export const CustomHighlight = Mark.create({
  name: "highlight",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element) => element.style.backgroundColor || null,
        renderHTML: (attributes) => {
          if (!attributes.color) return {};
          return { style: `background-color: ${attributes.color}` };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "mark",
      },
      {
        style: "background-color",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "mark",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      setHighlight:
        (color) =>
        ({ commands }) =>
          commands.setMark(this.name, { color }),
      unsetHighlight:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
      toggleHighlight:
        (color) =>
        ({ commands, state }) => {
          const isActive = state.selection.$from
            .marks()
            .some((mark) => mark.type.name === this.name);
          return isActive
            ? commands.unsetHighlight()
            : commands.setHighlight(color);
        },
    };
  },
});
