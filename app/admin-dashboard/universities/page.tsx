import UniversityTable from "../components/UniversityTable";

export default function UniversitiesPage() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-8 px-4 sm:px-6">University Management</h1>
      <div className="px-4 sm:px-6">
        <UniversityTable />
      </div>
    </div>
  );
}
