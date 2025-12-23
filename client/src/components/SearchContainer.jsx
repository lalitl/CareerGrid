import { FormRow, FormRowSelect, SubmitBtn } from "../components";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { Form, useSubmit, Link } from "react-router-dom";
import { useAllJobsContext } from "../pages/AllJobs";
import { JOB_STATUS, JOB_TYPE, JOB_SORT_TYPE } from "../../../utils/constants";

const SearchContainer = () => {
  const { searchValues } = useAllJobsContext();
  const { search, jobStatus, jobType, sort } = searchValues;
  const submit = useSubmit();

  const debounce = (onChange) => {
    let timeout;
    return (e) => {
      clearTimeout(timeout);
      const form = e.currentTarget.form;
      timeout = setTimeout(() => {
        onChange(form);
      }, 2500);
    };
  };
  return (
    <Wrapper>
      <Form className="form">
        <h5 className="form-title">Search Jobs</h5>
        <div className="form-center">
          <FormRow
            type="search"
            name="search"
            defaultValue={search}
            labelText="Search"
            onChange={debounce((form) => {
              submit(form);
            })}
          />
          <FormRowSelect
            labelText="job status"
            name="jobStatus"
            data={["all", ...Object.values(JOB_STATUS)]}
            defaultValue={jobStatus}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
          <FormRowSelect
            labelText="job type"
            name="jobType"
            data={["all", ...Object.values(JOB_TYPE)]}
            defaultValue={jobType}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
          <FormRowSelect
            labelText="sort by"
            name="sort"
            data={["all", ...Object.values(JOB_SORT_TYPE)]}
            defaultValue={sort}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
          <Link to="/dashboard/all-jobs" className="btn form-btn delete-btn">
            Clear Filters
          </Link>
        </div>
      </Form>
    </Wrapper>
  );
};
export default SearchContainer;
