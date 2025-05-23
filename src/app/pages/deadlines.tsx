import React from "react";
import DeadlineList from "../components/DeadlineList";
import Layout from "../components/Layout";

const DeadlinesPage: React.FC = () => {
  return (
    <Layout>
      <DeadlineList />
    </Layout>
  );
};

export default DeadlinesPage;
