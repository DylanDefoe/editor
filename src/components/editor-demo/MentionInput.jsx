import { useCallback, useRef, useState } from "react";
import { Input } from "antd";
import VariableMention from "./VariableMention";

function MentionInput({ value, onChange, variables, placeholder }) {
  const inputRef = useRef(null);
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionPosition, setMentionPosition] = useState(null);

  const closeMention = useCallback(() => {
    setMentionOpen(false);
    setMentionPosition(null);
  }, []);

  const openMention = useCallback(() => {
    const inputElement = inputRef.current?.input;
    if (!inputElement) {
      return;
    }

    const rect = inputElement.getBoundingClientRect();
    setMentionPosition({
      top: rect.bottom + 6,
      left: rect.left,
    });
    setMentionOpen(true);
  }, []);

  const updateValue = useCallback(
    (nextValue) => {
      onChange?.(nextValue);
    },
    [onChange],
  );

  const handleInputChange = useCallback(
    (event) => {
      updateValue(event.target.value);
    },
    [updateValue],
  );

  const handleVariableSelect = useCallback(
    (preset) => {
      const insertValue = String(preset?.value ?? "").trim();
      if (!insertValue) {
        closeMention();
        return;
      }

      const sourceValue = String(value ?? "");
      const triggerIndex = sourceValue.lastIndexOf("@");

      const nextValue =
        triggerIndex >= 0
          ? `${sourceValue.slice(0, triggerIndex)}${insertValue}${sourceValue.slice(
              triggerIndex + 1,
            )}`
          : `${sourceValue}${insertValue}`;

      updateValue(nextValue);
      closeMention();
      requestAnimationFrame(() => {
        inputRef.current?.input?.focus();
      });
    },
    [closeMention, updateValue, value],
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "@") {
        requestAnimationFrame(() => {
          openMention();
        });
      }

      if (event.key === "Escape" && mentionOpen) {
        event.preventDefault();
        closeMention();
      }
    },
    [closeMention, mentionOpen, openMention],
  );

  return (
    <>
      <Input
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      <VariableMention
        open={mentionOpen}
        variables={variables ?? []}
        position={mentionPosition}
        onSelect={handleVariableSelect}
        onClose={closeMention}
      />
    </>
  );
}

export default MentionInput;
