import React from 'react';
import {createStackNavigator} from "react-navigation";
import CourseList from "./components/CourseList";
import ModuleList from "./components/ModuleList";
import LessonList from "./components/LessonList";
import WidgetList from "./components/WidgetList";
import AssignmentEditor from "./components/AssignmentEditor";
import ExamEditor from "./components/ExamEditor";
import QuestionEditor from "./components/QuestionEditor";


const App = createStackNavigator({
    CourseList,
    ModuleList,
    LessonList,
    WidgetList,
    AssignmentEditor,
    ExamEditor,
    QuestionEditor
});

export default App;
