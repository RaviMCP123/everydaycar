import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Flex,
  Input,
  Modal,
  Select,
  Skeleton,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { SorterResult } from "antd/es/table/interface";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router";
import ActionButton from "@components/Table/Action";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import PageMeta from "@components/common/PageMeta";
import { PAGE_LIMIT } from "@utils/constant/common";
import {
  useGetBookRepairRequestsQuery,
  useUpdateBookRepairRequestStatusMutation,
} from "@services/bookRepairRequestApi";
import type { BookRepairRequest } from "interface/bookRepairRequest";

function formatDateTime(value: unknown): string {
  if (value == null || value === "") return "";
  let d: Date;
  if (typeof value === "object" && value !== null && "$date" in value) {
    d = new Date(String((value as { $date: string }).$date));
  } else {
    d = new Date(String(value));
  }
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatStatusLabel(status?: string): string {
  if (status === "completed") return "Completed";
  if (status === "in_progress") return "In Progress";
  return "New";
}

type BookRepairStatusFilter = BookRepairRequest["status"] | "";

function parseStatusFilter(value: string | null): BookRepairStatusFilter {
  if (value === "new" || value === "in_progress" || value === "completed") {
    return value;
  }
  return "";
}

function formatVehicleLabel(record: BookRepairRequest): string {
  const parts = [record.vehicleMake, record.vehicleModel, record.vehicleYear]
    .map((part) => (part || "").trim())
    .filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "-";
}

function renderStatusTag(status?: BookRepairRequest["status"]) {
  const normalized = status || "new";
  if (normalized === "completed") {
    return (
      <Tag className="!m-0 !rounded-md !border-green-200 !bg-green-50 !px-2.5 !py-0.5 !text-green-700">
        Completed
      </Tag>
    );
  }
  if (normalized === "in_progress") {
    return (
      <Tag className="!m-0 !rounded-md !border-blue-200 !bg-blue-50 !px-2.5 !py-0.5 !text-blue-700">
        In Progress
      </Tag>
    );
  }
  return (
    <Tag className="!m-0 !rounded-md !border-gray-200 !bg-gray-100 !px-2.5 !py-0.5 !text-gray-700">
      New
    </Tag>
  );
}

const BookRepairRequestPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_LIMIT);
  const [statusFilter, setStatusFilter] = useState<BookRepairStatusFilter>(() =>
    parseStatusFilter(searchParams.get("status")),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [sortedInfo, setSortedInfo] = useState<SorterResult<BookRepairRequest> | null>(
    null,
  );
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BookRepairRequest | null>(null);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [updateStatus] = useUpdateBookRepairRequestStatusMutation();

  useEffect(() => {
    setStatusFilter(parseStatusFilter(searchParams.get("status")));
    setPage(1);
  }, [searchParams]);

  const queryParams = useMemo(
    () => ({
      page,
      limit: pageSize,
      sort:
        typeof sortedInfo?.field === "string" ? sortedInfo.field : "createdAt",
      direction: sortedInfo?.order === "ascend" ? "asc" : "desc",
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(appliedSearch ? { search: appliedSearch } : {}),
    }),
    [page, pageSize, sortedInfo, statusFilter, appliedSearch],
  );

  const { data, isLoading, isFetching } = useGetBookRepairRequestsQuery(queryParams);
  const rows = data?.data?.results ?? [];
  const total = data?.data?.pagination?.total ?? 0;

  const handleStatusUpdate = async (nextStatus: "new" | "in_progress" | "completed") => {
    if (!selectedRequest) return;
    const id = selectedRequest._id || selectedRequest.id;
    if (!id) return;
    try {
      setIsStatusUpdating(true);
      await updateStatus({ id, status: nextStatus }).unwrap();
      setSelectedRequest((current) =>
        current ? { ...current, status: nextStatus } : current,
      );
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const handleReset = () => {
    setPage(1);
    setPageSize(PAGE_LIMIT);
    setSortedInfo(null);
    setStatusFilter("");
    setSearchQuery("");
    setAppliedSearch("");
    setSearchParams({});
  };

  const handleSearch = (value: string) => {
    setAppliedSearch(value.trim());
    setPage(1);
  };

  const handleStatusFilterChange = (value: BookRepairStatusFilter) => {
    setStatusFilter(value);
    setPage(1);
    if (value) {
      setSearchParams({ status: value });
    } else {
      setSearchParams({});
    }
  };

  const hasActiveFilters = Boolean(appliedSearch || statusFilter);

  const columns: ColumnsType<BookRepairRequest> = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      width: 150,
      ellipsis: true,
      render: (value: string) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {value || "-"}
        </span>
      ),
    },
    {
      title: "Mobile",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      width: 140,
      ellipsis: true,
      render: (value: string) => value || "-",
    },
    {
      title: "Suburb",
      dataIndex: "suburb",
      key: "suburb",
      width: 120,
      ellipsis: true,
      render: (value: string) => value || "-",
    },
    {
      title: "Vehicle",
      key: "vehicle",
      width: 220,
      ellipsis: { showTitle: true },
      render: (_, record) => formatVehicleLabel(record),
    },
    {
      title: "Accident Date",
      dataIndex: "accidentDate",
      key: "accidentDate",
      width: 120,
      ellipsis: true,
      render: (value: string) => value || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (value: BookRepairRequest["status"]) => renderStatusTag(value),
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      fixed: "right",
      align: "center",
      render: (_value, record) => (
        <ActionButton
          isView={true}
          onViewAction={() => {
            setSelectedRequest(record);
            setIsViewOpen(true);
          }}
        />
      ),
    },
  ];

  const tableScrollX = columns.reduce(
    (total, column) => total + (typeof column.width === "number" ? column.width : 140),
    0,
  );

  return (
    <>
      <PageMeta title="Book Repair Requests" />
      <PageBreadcrumb pageTitle="Book Repair Requests" />
      <div className="min-h-[calc(100vh-186px)] overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-white/[0.03] md:px-6 md:py-6">
        <Flex justify="space-between" align="center" className="mb-4" wrap="wrap" gap="middle">
          <div>
            <Typography.Title level={4} className="!mb-1">
              Book Repair Requests
            </Typography.Title>
            <Typography.Text type="secondary" className="text-sm">
              {isFetching ? "Loading..." : `${total} request${total === 1 ? "" : "s"}`}
            </Typography.Text>
          </div>
          {hasActiveFilters ? (
            <Button
              icon={<UndoOutlined />}
              onClick={handleReset}
              className="!rounded-lg"
            >
              Reset filters
            </Button>
          ) : null}
        </Flex>

        <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50/70 p-3 dark:border-gray-800 dark:bg-white/[0.02] md:p-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_auto] lg:items-center">
            <Input
              allowClear
              size="large"
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Search by name, mobile or vehicle"
              value={searchQuery}
              onChange={(event) => {
                const next = event.target.value;
                setSearchQuery(next);
                if (!next.trim()) {
                  setAppliedSearch("");
                  setPage(1);
                }
              }}
              onPressEnter={() => handleSearch(searchQuery)}
            />
            <Select
              allowClear
              size="large"
              placeholder="Filter by status"
              value={statusFilter || undefined}
              options={[
                { label: "New (Pending)", value: "new" },
                { label: "In Progress", value: "in_progress" },
                { label: "Completed", value: "completed" },
              ]}
              onChange={(value) =>
                handleStatusFilterChange((value ?? "") as BookRepairStatusFilter)
              }
            />
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              onClick={() => handleSearch(searchQuery)}
              className="!rounded-lg !bg-brand-500 hover:!bg-brand-600"
            >
              Search
            </Button>
          </div>
        </div>

        {isLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <Table<BookRepairRequest>
            tableLayout="fixed"
            rowKey={(row) => row._id ?? row.id ?? `${row.mobileNumber}-${row.createdAt}`}
            columns={columns}
            dataSource={rows}
            bordered={false}
            size="middle"
            scroll={{ x: tableScrollX }}
            pagination={{
              current: page,
              pageSize,
              total,
              showSizeChanger: true,
              showTotal: (count, range) => `${range[0]}-${range[1]} of ${count}`,
              pageSizeOptions: ["10", "20", "50"],
              onChange: (p, ps) => {
                setPage(p);
                setPageSize(ps);
              },
            }}
            onChange={(pagination, filters, sorter) => {
              void filters;
              setSortedInfo(sorter as SorterResult<BookRepairRequest>);
              setPage(pagination.current ?? 1);
              setPageSize(pagination.pageSize ?? PAGE_LIMIT);
            }}
          />
        )}
      </div>
      <Modal
        open={isViewOpen}
        title="Book Repair Request Details"
        onCancel={() => {
          setIsViewOpen(false);
          setSelectedRequest(null);
        }}
        footer={null}
        width={900}
        zIndex={3000}
        centered
        styles={{
          body: {
            maxHeight: "70vh",
            overflowY: "auto",
            paddingRight: 8,
          },
        }}
      >
        {selectedRequest ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                { label: "Full Name", value: selectedRequest.fullName || "-" },
                { label: "Mobile Number", value: selectedRequest.mobileNumber || "-" },
                { label: "Email", value: selectedRequest.email || "-" },
                { label: "Suburb / Postcode", value: selectedRequest.suburb || "-" },
                { label: "Accident Date", value: selectedRequest.accidentDate || "-" },
                { label: "Accident Location", value: selectedRequest.accidentLocation || "-" },
                {
                  label: "Driveable After Accident",
                  value:
                    selectedRequest.driveable === "yes"
                      ? "Yes"
                      : selectedRequest.driveable === "no"
                        ? "No"
                        : "Not sure",
                },
                {
                  label: "Other Driver At Fault",
                  value: selectedRequest.otherDriverAtFault === "yes" ? "Yes" : "No",
                },
                { label: "Vehicle Make", value: selectedRequest.vehicleMake || "-" },
                { label: "Vehicle Model", value: selectedRequest.vehicleModel || "-" },
                { label: "Vehicle Year", value: selectedRequest.vehicleYear || "-" },
                { label: "Registration Number", value: selectedRequest.registrationNumber || "-" },
                { label: "Vehicle Colour", value: selectedRequest.vehicleColour || "-" },
                { label: "Preferred Callback Time", value: selectedRequest.callbackTime || "-" },
                { label: "Created At", value: formatDateTime(selectedRequest.createdAt) || "-" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-white/[0.04]">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{item.label}</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{item.value}</p>
                </div>
              ))}
              <div className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-white/[0.04]">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Status</p>
                <Select
                  size="middle"
                  className="mt-2 w-full"
                  value={(selectedRequest.status || "new") as "new" | "in_progress" | "completed"}
                  loading={isStatusUpdating}
                  disabled={isStatusUpdating}
                  options={[
                    { label: "New", value: "new" },
                    { label: "In Progress", value: "in_progress" },
                    { label: "Completed", value: "completed" },
                  ]}
                  onChange={(value) =>
                    handleStatusUpdate(value as "new" | "in_progress" | "completed")
                  }
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Current: {formatStatusLabel(selectedRequest.status)}
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-white/[0.04]">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Accident Description
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-900 dark:text-white">
                {selectedRequest.accidentDescription || "-"}
              </p>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
};

export default BookRepairRequestPage;
