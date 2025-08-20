import { useQuery } from "@tanstack/react-query";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { characterDetailsRoute } from "../router";
import "./style.css";

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
}

type CharactersResponse = {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
};

const fetchCharacters = async (page: number): Promise<CharactersResponse> => {
  const res = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
};


function CharactersList({ page }: { page: number }) {
  const { data, refetch, isLoading, isError } = useQuery<CharactersResponse>({
    queryKey: ["characters", page],
    queryFn: () => fetchCharacters(page),
    staleTime: 1000 * 60 * 5
  });

  const table = useReactTable<Character>({
    data: data?.results || [],
    columns: [
      {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => (
          <Link
            to={characterDetailsRoute.to}
            params={{ id: row.original.id.toString() }}
            className="text-blue-600 hover:underline"
          >
            {row.original?.name}
          </Link>
        ),
      },
      { header: "Status", accessorKey: "status" },
      { header: "Species", accessorKey: "species" },
      {
        header: "Image",
        accessorKey: "image",
        cell: ({ getValue }) => (
          <img
            src={getValue<string>()}
            width={70}
            height={70}
            alt="character"
            className="w-12 h-12 rounded-full border"
          />
        ),
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading data</p>;

  return (
    <div className="p-4">
      <h2>Rick And Morty</h2>


      <table className="border border-gray-300 w-full" width={1000}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th className="border p-2" key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="charactersListData">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="tableGridItem">
              {row.getVisibleCells().map((cell) => (
                <td className="border p-2 tableGridItemData" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>


      <button
        onClick={() => refetch()}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Refresh
      </button>

      <div className="mt-4 flex gap-2 paginationControls">
        {/* Prev */}
        {page > 1 ? (
          <Link
            to="/characters"
            search={{ page: page - 1 }}
            className="px-4 py-2 border rounded"
          >
            Prev
          </Link>
        ) : (
          <span className="px-4 py-2 border rounded opacity-50 cursor-not-allowed">
            Prev
          </span>
        )}

        {/* Next */}
        {data?.info?.next ? (
          <Link
            to="/characters"
            search={{ page: page + 1 }}
            className="px-4 py-2 border rounded"
          >
            Next
          </Link>
        ) : (
          <span className="px-4 py-2 border rounded opacity-50 cursor-not-allowed">
            Next
          </span>
        )}
      </div>


    </div>
  );
}

export default CharactersList;
