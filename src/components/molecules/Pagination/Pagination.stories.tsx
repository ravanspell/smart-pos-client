import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CustomPagination } from "./index";

const meta: Meta<typeof CustomPagination> = {
  title: "Molecules/Pagination",
  component: CustomPagination,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    totalRecords: {
      control: { type: "number", min: 0 },
      description: "Total number of records in the dataset",
    },
    itemsPerPage: {
      control: { type: "number", min: 1 },
      description: "Number of items displayed per page",
    },
    currentPage: {
      control: { type: "number", min: 1 },
      description: "Current active page",
    },
    siblingsCount: {
      control: { type: "number", min: 0, max: 3 },
      description: "Number of sibling pages to show on each side of the current page",
    },
    showFirstAndLast: {
      control: { type: "boolean" },
      description: "Whether to always show first and last page numbers",
    },
    onPageChange: {
      action: "page changed",
      description: "Function called when page is changed",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CustomPagination>;

export const Default: Story = {
  args: {
    totalRecords: 100,
    itemsPerPage: 10,
    currentPage: 1,
    siblingsCount: 1,
    showFirstAndLast: true,
  },
};

export const FewPages: Story = {
  args: {
    totalRecords: 30,
    itemsPerPage: 10,
    currentPage: 2,
    siblingsCount: 1,
    showFirstAndLast: true,
  },
};

export const ManyPages: Story = {
  args: {
    totalRecords: 500,
    itemsPerPage: 10,
    currentPage: 25,
    siblingsCount: 1,
    showFirstAndLast: true,
  },
};

export const MiddlePages: Story = {
  args: {
    totalRecords: 200,
    itemsPerPage: 10,
    currentPage: 10,
    siblingsCount: 1,
    showFirstAndLast: true,
  },
};

export const WithoutFirstAndLastPages: Story = {
  args: {
    totalRecords: 200,
    itemsPerPage: 10,
    currentPage: 10,
    siblingsCount: 1,
    showFirstAndLast: false,
  },
};

export const WithMoreSiblings: Story = {
  args: {
    totalRecords: 200,
    itemsPerPage: 10,
    currentPage: 10,
    siblingsCount: 2,
    showFirstAndLast: true,
  },
};

export const Interactive: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const totalRecords = 237;
    
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };
    
    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setItemsPerPage(Number(event.target.value));
      setCurrentPage(1); // Reset to first page when changing items per page
    };
    
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div>
            <label htmlFor="itemsPerPage" className="mr-2 text-sm font-medium">
              Items per page:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="rounded border border-gray-300 p-1"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div>
            <span className="text-sm">
              Page {currentPage} of {Math.ceil(totalRecords / itemsPerPage)}
            </span>
          </div>
        </div>
        
        <div className="pt-2">
          <CustomPagination
            totalRecords={totalRecords}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            siblingsCount={1}
            showFirstAndLast={true}
          />
        </div>
        
        <div className="mt-4 rounded bg-gray-100 p-4">
          <p className="text-sm text-gray-700">
            Showing items{" "}
            <span className="font-medium">
              {Math.min((currentPage - 1) * itemsPerPage + 1, totalRecords)}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, totalRecords)}
            </span>{" "}
            of <span className="font-medium">{totalRecords}</span> results
          </p>
        </div>
      </div>
    );
  },
};