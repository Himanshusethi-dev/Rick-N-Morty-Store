import { useQuery } from "@tanstack/react-query";
import "./style.css";

function CharacterDetails({ id }: { id: string }) {

    const { data, isLoading, isError } = useQuery({
        queryKey: ["character", id],
        queryFn: async () => {
            const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
            if (!res.ok) throw new Error("Network response was not ok");
            return res.json();
        },
    });

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading data</p>;

    return (
        <div className="p-4 characterDetails">
            <div className="characterHeader">
                <h2 className="text-2xl font-bold mb-4">{data.name}</h2>
                                <img src={data.image} alt={data.name} className="mb-4" />

            </div>
            <div className="characterInfo">
                <p>Status: {data.status}</p>
                <p>Species: {data.species}</p>
                <p>Gender: {data.gender}</p>
                <p>Origin: {data.origin.name}</p>
            </div>
        </div>
    );
}

export default CharacterDetails;