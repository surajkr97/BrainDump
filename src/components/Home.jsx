import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

const Home = () => {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const noteId = searchParams.get("id");
  const dispatch = useDispatch();

  const createNote = () =>{
    const note = {
      title: title,
      content: value,
      _id: noteId || Date.now().toString(36),
      createdAt: new Date().toISOString(),
    }

    if(noteId){
      // Update note
      dispatch(updateToNotes(note))
    }
    else {
      // Create note
      dispatch(addToNotes(note))
    }

    //after creating or updating the note, reset the input fields
    setTitle("");
    setValue("");
    setSearchParams({});

  }

  return (
    <div>
      <div className="flex justify-center gap-4">
        <input
          type="text"
          placeholder="Enter Title Here"
          className="border-y-sky-200 border-1 rounded-md px-1 mt-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="bg-sky-600 rounded-md px-2 mt-2 cursor-pointer hover:bg-sky-900"
          onClick={createNote}
        >
          {noteId ? "Update Note" : "Create Note"}
        </button>
      </div>
      <div className="mt-4">
        <textarea
          value={value}
          className="border-y-sky-200 border-1 rounded-md px-1 mt-2 w-80"
          placeholder="Enter Note Here"
          onChange={(e) => setValue(e.target.value)}
          rows={20}
        ></textarea>
      </div>
    </div>
  );
};

export default Home;
