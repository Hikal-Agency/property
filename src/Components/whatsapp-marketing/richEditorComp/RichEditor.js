import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function RichEditor({setMessageValue, messageValue=""}) {

  const editorRef = useRef(null);

  return (
    <>
      <Editor
        apiKey='asb4zu1qlqrydo9vhg8yo2co2t7kjhb2efga5v04gl0ejx35'
        onInit={(evt, editor) => editorRef.current = editor}
        onEditorChange={() => setMessageValue(editorRef.current.getContent())}
        initialValue={messageValue}
        init={{
          height: 500,
          menubar: false,
          statusbar: false,
          toolbar: 'undo redo | ' +
            'bold italic strikethrough | numlist ' +
            'removeformat',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
    </>
  );
}