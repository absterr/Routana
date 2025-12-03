import columns from "./Columns";
import GoalsTable from "./CustomTable/GoalsTable";
import tasks from "./tasks";

const GoalsPage = () => {
  return (
    <section className="flex justify-center">
      <div className="">
        <div className="flex flex-1 flex-col gap-8 p-8">
          <div className="flex items-center justify-between gap-2">
            <header className="flex flex-col gap-1">
              <h1 className="text-3xl font-semibold tracking-tight">
                Goals
              </h1>
              <p className="text-muted-foreground">
                Here&apos;s a list of your goals.
              </p>
            </header>
          </div>
            <GoalsTable data={tasks} columns={columns} />
        </div>
      </div>
    </section>
  );
}

export default GoalsPage;
