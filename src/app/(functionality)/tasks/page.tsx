"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import Modal from "react-modal";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import { auth, tasks as taskref } from "@/firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { nanoid } from "nanoid";
import {
  addDoc,
  arrayUnion,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import SideMenu from "@/components/SideMenu";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Task {
  taskId: string;
  heading: string;
  description: string;
  date: string;
  status: "Not Started" | "In Progress" | "Done";
  comments: { text: string; userId: string }[];
  userId: string;
}
const Page: React.FC = () => {
  const user = useAuthState(auth);
  const userSession = sessionStorage.getItem("user");
  console.log({ user });
  console.log(sessionStorage);
  const router = useRouter();

  if (!user && !userSession) {
    router.push("/register");
  }
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [commentModalIsOpen, setCommentModalIsOpen] = useState<boolean>(false);
  const [task, setTask] = useState<Task>({
    taskId: "",
    heading: "",
    description: "",
    date: new Date().toDateString(),
    status: "Not Started",
    comments: [],
    userId: "",
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    task.date ? new Date(task.date) : new Date()
  );
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const [commentInput, setCommentInput] = useState<string>("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openCommentModal = (taskId: string) => {
    setSelectedTaskId(taskId);
    setCommentModalIsOpen(true);
  };

  const closeCommentModal = () => {
    setSelectedTaskId(null);
    setCommentInput("");
    setCommentModalIsOpen(false);
  };

  const handleDateChange = (date: Date) => {
    const dateString = date.toDateString();
    setSelectedDate(date);
    setTask({ ...task, date: dateString });
  };

  const handleTaskChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCommentInput(e.target.value);
  };

  const handleTaskCompletion = async (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.taskId === taskId
          ? {
              ...t,
              status:
                t.status === "Not Started"
                  ? "In Progress"
                  : t.status === "In Progress"
                  ? "Done"
                  : "Not Started",
            }
          : t
      )
    );
    try {
      const tasksQuerySnapshot = await getDocs(
        query(taskref, where("taskId", "==", taskId))
      );

      if (!tasksQuerySnapshot.empty) {
        const taskDoc = tasksQuerySnapshot.docs[0];
        const taskDocRef = doc(taskref, taskDoc.id);

        await updateDoc(taskDocRef, {
          status:
            taskDoc.data().status === "Not Started"
              ? "In Progress"
              : taskDoc.data().status === "In Progress"
              ? "Done"
              : "Not Started",
        });

        console.log("Task status updated successfully in the database");
      } else {
        console.error("Task not found in Firestore");
      }
    } catch (error) {
      console.error("Error updating task status in the database", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((t) => t.taskId !== taskId));
    const taskDocRef = doc(taskref, taskId);
    try {
      const tasksQuerySnapshot = await getDocs(
        query(taskref, where("taskId", "==", taskId))
      );

      if (!tasksQuerySnapshot.empty) {
        const taskDoc = tasksQuerySnapshot.docs[0];
        const taskDocRef = doc(taskref, taskDoc.id);

        await deleteDoc(taskDocRef);

        console.log("Task deleted successfully from the database");
      } else {
        console.error("Task not found in Firestore");
      }
    } catch (error) {
      console.error("Error deleting task from the database", error);
    }
  };

  const handleSaveTask = async () => {
    const taskDate = selectedDate
      ? selectedDate.toDateString()
      : new Date().toDateString();
    const random = nanoid();

    setTasks([
      ...tasks,
      { ...task, taskId: random, date: taskDate, status: "Not Started" },
    ]);
    addDoc(taskref, {
      ...task,
      taskId: random,
      date: taskDate,
      status: "Not Started",
      userId: user[0]!.uid,
    })
      .then((docRef) => {
        console.log("Document has been added successfully");
      })
      .catch((error) => {
        console.log(error);
      });
    setTask({
      taskId: "",
      heading: "",
      description: "",
      date: new Date().toDateString(),
      status: "Not Started",
      comments: [],
      userId: user[0]!.uid,
    });
    closeModal();
  };

  const handleSaveComment = async () => {
    const updatedTasks = tasks.map((t) =>
      t.taskId === selectedTaskId
        ? {
            ...t,
            comments: [
              ...t.comments,
              { text: commentInput, userId: user[0]!.uid },
            ],
          }
        : t
    );
    setTasks(updatedTasks);
    const tasksQuerySnapshot = await getDocs(
      query(taskref, where("taskId", "==", selectedTaskId))
    );

    if (!tasksQuerySnapshot.empty) {
      const taskDoc = tasksQuerySnapshot.docs[0];
      const taskDocRef = doc(taskref, taskDoc.id);

      try {
        console.log("Updating document in Firestore:", taskDoc.data());
        await updateDoc(taskDocRef, {
          comments: arrayUnion({ text: commentInput, userId: user[0]!.uid }),
        });
        console.log("Comment has been added successfully to the database");
      } catch (error) {
        console.error("Error adding comment to the database", error);
      }
    } else {
      console.error("Task not found in Firestore");
    }
    setCommentInput("");
    closeCommentModal();
  };

  const filteredTasks = showCompleted
    ? tasks.filter((task) => task.status === "Done")
    : tasks.filter((task) => task.status !== "Done");

  useEffect(() => {
    const fetchTasks = async () => {
      if (user[0] && user[0]!.uid) {
        const userTasksQuerySnapshot = await getDocs(
          query(taskref, where("userId", "==", user[0]!.uid))
        );

        const userTasks = userTasksQuerySnapshot.docs.map(
          (doc) => doc.data() as Task
        );
        setTasks(userTasks);
      }
    };

    fetchTasks();
  }, [user]);
  const findName = (userId: String) => {
    return userId;
  };
  return (
    <section className="flex">
      <SideMenu />
      <main className="min-h-screen w-[75vw] flex flex-col px-28 py-16">
        <h1 className="text-2xl font-semibold">Today</h1>
        <div className="flex justify-between mt-12">
          <button className="w-fit text-gray-600" onClick={openModal}>
            <span className="text-blue-400 text-lg">+&nbsp;&nbsp;</span>
            Add Task
          </button>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="text-gray-600"
          >
            {showCompleted ? "Show Incomplete" : "Show Completed"}
          </button>
        </div>
        <Modal
          isOpen={modalIsOpen}
          ariaHideApp={false}
          onRequestClose={closeModal}
          contentLabel="Task Modal"
          className="flex flex-col items-center justify-center w-1/2 px-8 py-6 bg-white rounded-lg shadow-lg absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border"
        >
          <input
            type="text"
            id="taskHeading"
            name="heading"
            placeholder="Task Name"
            value={task.heading}
            onChange={handleTaskChange}
            className="w-full p-3 my-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 font-bold"
          />
          <textarea
            id="taskDescription"
            name="description"
            placeholder="Add description (optional)"
            value={task.description}
            onChange={handleTaskChange}
            className="w-full p-3 my-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />

          <div className="flex justify-center my-4">
            <DatePicker
              selected={selectedDate}
              // @ts-ignore
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              value={selectedDate}
              className="p-3 border border-gray-300 rounded-md focus:outline-none"
              calendarClassName="bg-white shadow-md"
              required
            />
          </div>

          <div className="flex justify-end mt-4 space-x-4">
            <button
              onClick={handleSaveTask}
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Save Task
            </button>
            <button
              onClick={closeModal}
              className="px-4 py-2 border border-black rounded-md hover:border-gray-700 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </Modal>
        <Modal
          isOpen={commentModalIsOpen}
          onRequestClose={closeCommentModal}
          contentLabel="Comment Modal"
          className="flex flex-col items-center justify-center w-1/2 px-8 py-6 bg-white rounded-lg shadow-lg absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border"
        >
          <textarea
            id="commentInput"
            placeholder="Add comment"
            value={commentInput}
            onChange={handleCommentChange}
            className="w-full p-3 my-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />

          <div className="flex justify-end mt-4 space-x-4">
            <button
              onClick={handleSaveComment}
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Save Comment
            </button>
            <button
              onClick={closeCommentModal}
              className="px-4 py-2 border border-black rounded-md hover:border-gray-700 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </Modal>
        {filteredTasks.map((task) => (
          <div
            key={task.taskId}
            className="task-item p-6 my-4 border rounded-md bg-blue-100 border-blue-200 space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="h-full flex px-1 items-center">
                <input
                  type="checkbox"
                  checked={task.status === "Done"}
                  onChange={() => handleTaskCompletion(task.taskId)}
                  className="mr-2 cursor-pointer h-4 w-4 text-blue-500 focus:ring-blue-400"
                />
              </div>
              <button
                onClick={() => handleDeleteTask(task.taskId)}
                className="text-red-500 hover:bg-red-500 hover:text-white px-3 py-2 border border-red-500 rounded-md"
              >
                Delete
              </button>
            </div>
            <h3 className="text-2xl font-bold">{task.heading}</h3>
            <p className="text-sm text-gray-700 mt-3">{task.description}</p>
            <p className="text-sm text-gray-500 mt-3 flex items-center justify-between">
              <span>
                Date: {task.date ? task.date.toLocaleString() : "Invalid Date"}
              </span>
              <button
                onClick={() => openCommentModal(task.taskId)}
                className="bg-blue-500 text-white px-1.5 py-1 rounded-md hover:bg-blue-600"
              >
                Add Comment
              </button>
            </p>
            {task.comments.length > 0 && (
              <div className="mt-3">
                <strong className="block mb-2">Comments:</strong>
                <ul className="list-disc list-inside">
                  {task.comments.map((comment, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      <Link href={"/tasks/" + comment.userId}>
                        {comment.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        <div
          className="absolute bottom-8 right-12"
          onClick={() => {
            sessionStorage.removeItem("user");
            router.push("/login");
          }}
        >
          Logout
        </div>
      </main>
    </section>
  );
};

export default Page;
