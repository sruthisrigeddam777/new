import { useState } from "react";
import Proctoring from "./Proctoring";

const ExamPage = () => {
  const [examEnded, setExamEnded] = useState(false);

  const endExam = () => {
    setExamEnded(true);
  };

  return (
    <div>
      {examEnded ? (
        <h2>Exam Ended! You are disqualified due to malpractice.</h2>
      ) : (
        <>
          <h1>Exam Ongoing</h1>
          <Proctoring user={{ id: 123 }} onExamEnd={endExam} />  {/* ✅ Ensure this is passed */}
        </>
      )}
    </div>
  );
};

export default ExamPage;
