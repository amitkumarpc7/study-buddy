import React from "react";
import NotesPage from "../components/NotesPage";
import Layout from "../components/Layout";

const NotesPageWrapper: React.FC = () => {
  return (
    <Layout>
      <NotesPage />
    </Layout>
  );
};

export default NotesPageWrapper;
