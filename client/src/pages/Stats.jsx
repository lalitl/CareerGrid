import { toast } from "react-toastify";
import { StatsContainer, ChartsContainer } from "../components";
import { useLoaderData } from "react-router-dom";
import customFetch from "../utils/customFtech";
export const loader = async () => {
  try {
    const res = await customFetch.get("/jobs/show-stats");
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Stats = () => {
  const { defaultStats, monthlyApplications } = useLoaderData();
  console.log(defaultStats, monthlyApplications);

  return (
    <>
      <StatsContainer defaultStats={defaultStats} />
      {monthlyApplications.length > 1 && (
        <ChartsContainer data={monthlyApplications} />
      )}
    </>
  );
};
export default Stats;