import Dashboard from "views/Dashboard.js";
import UploadRecording from "views/UploadRecording";
import BatchUploadRecording from "views/BatchUpload";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/upload-recording",
    name: "Recordings",
    icon: "tim-icons icon-upload",
    component: UploadRecording,
    layout: "/admin"
  },
];
export default routes;
