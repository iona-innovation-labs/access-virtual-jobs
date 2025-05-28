import { IJobListing } from "@/types/jobs";
import JobCard from "./job-card";

type Props = {
    positions: IJobListing[];
    isPublic?: boolean;
};


export const JobList = ({ positions, isPublic = false }: Props) => {
    return (
        <section id="joblist_container" className="container mx-auto px-[10%] py-8 md:py-12 lg:py-14">
            <div className="container">
                <div className="flex flex-col gap-6 md:gap-8">
                    {positions.map((position) => (
                        <JobCard key={position.id} job={position} isPublic={isPublic} />
                    ))}
                </div>
            </div>
        </section>
    );
};