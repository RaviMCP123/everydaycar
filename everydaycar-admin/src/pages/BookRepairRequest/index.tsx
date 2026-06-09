import React, { useMemo, useState } from "react";
import { Flex, Modal, Select, Skeleton, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { SorterResult } from "antd/es/table/interface";
import { UndoOutlined } from "@ant-design/icons";
import ActionButton from "@components/Table/Action";
import IconButton from "@components/Table/IconButton";
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

const BookRepairRequestPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_LIMIT);
  const [sortedInfo, setSortedInfo] = useState<SorterResult<BookRepairRequest> | null>(
    null,
  );
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BookRepairRequest | null>(null);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [updateStatus] = useUpdateBookRepairRequestStatusMutation();
  const queryParams = useMemo(
    () => ({
      page,
      limit: pageSize,
      sort:
        typeof sortedInfo?.field === "string" ? sortedInfo.field : "createdAt",
      direction: sortedInfo?.order === "ascend" ? "asc" : "desc",
    }),
    [page, pageSize, sortedInfo],
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
  };

  const columns: ColumnsType<BookRepairRequest> = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      ellipsis: true,
      render: (value: string) => (
        <div className="font-semibold text-gray-900 dark:text-white">{value || "-"}</div>
      ),
    },
    { title: "Mobile", dataIndex: "mobileNumber", key: "mobileNumber", ellipsis: true },
    { title: "Suburb", dataIndex: "suburb", key: "suburb", ellipsis: true },
    {
      title: "Vehicle",
      key: "vehicle",
      ellipsis: true,
      render: (_, r) => `${r.vehicleMake} ${r.vehicleModel} (${r.vehicleYear})`,
    },
    {
      title: "Accident Date",
      dataIndex: "accidentDate",
      key: "accidentDate",
      ellipsis: true,
      render: (value: string) => value || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: BookRepairRequest["status"]) => {
        const normalized = value || "new";
        if (normalized === "completed") {
          return <Tag color="success">Completed</Tag>;
        }
        if (normalized === "in_progress") {
          return <Tag color="processing">In Progress</Tag>;
        }
        return <Tag color="default">New</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
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

  return (
    <>
      <PageMeta title="Book Repair Requests" />
      <PageBreadcrumb pageTitle="Book Repair Requests" />
      <div className="min-h-[calc(100vh-186px)] overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-white/[0.03] md:px-6 md:py-6">
        <Flex justify="space-between" align="center" className="mb-4">
          <Typography.Title level={4} className="!mb-0">
            Book Repair Requests
          </Typography.Title>
          <IconButton
            handleButtonAction={handleReset}
            title={isFetching ? "Loading..." : "Reset filters"}
            icon={<UndoOutlined />}
          />
        </Flex>
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <Table<BookRepairRequest>
            rowKey={(row) => row._id ?? row.id ?? `${row.mobileNumber}-${row.createdAt}`}
            columns={columns}
            dataSource={rows}
            bordered={false}
            size="middle"
            rowClassName={() => "bg-white dark:bg-gray-900/30 !border !border-gray-200 dark:!border-gray-700 rounded-lg"}
            pagination={{
              current: page,
              pageSize,
              total,
              showSizeChanger: true,
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
