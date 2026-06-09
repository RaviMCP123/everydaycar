import React, { useState } from "react";
import { Form, Input, Modal, Skeleton } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusCircleOutlined } from "@ant-design/icons";
import ActionFilter from "@components/Table/Action";
import IconButton from "@components/Table/IconButton";
import SwitchComponent from "@components/Table/Switch";
import TableContainer from "@components/Table/TableContainer";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import PageMeta from "@components/common/PageMeta";
import {
  useCreateNetworkRegionMutation,
  useDeleteNetworkRegionMutation,
  useGetNetworkRegionsQuery,
  useUpdateNetworkRegionMutation,
  useUpdateNetworkRegionStatusMutation,
} from "@services/networkRegionApi";
import type { NetworkRegion } from "interface/networkRegion";
import showToast from "@utils/toast";
import { PAGE_LIMIT } from "@utils/constant/common";
import { formatDate } from "@utils/dateFormat";

const NetworkRegionPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_LIMIT);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<NetworkRegion | null>(null);
  const [name, setName] = useState("");
  const { data, isLoading } = useGetNetworkRegionsQuery({ page, limit: pageSize });
  const [createRegion, { isLoading: creating }] = useCreateNetworkRegionMutation();
  const [updateRegion, { isLoading: updating }] = useUpdateNetworkRegionMutation();
  const [updateStatus] = useUpdateNetworkRegionStatusMutation();
  const [deleteRegion] = useDeleteNetworkRegionMutation();

  const rows = data?.data?.results ?? [];
  const total = data?.data?.pagination?.total ?? 0;

  const openAdd = () => {
    setEditing(null);
    setName("");
    setModalOpen(true);
  };

  const openEdit = (row: NetworkRegion) => {
    setEditing(row);
    setName(row.name || "");
    setModalOpen(true);
  };

  const submit = async () => {
    if (!name.trim()) {
      showToast("Region name is required.", "error");
      return;
    }
    if (editing?._id || editing?.id) {
      const id = (editing._id || editing.id)!;
      await updateRegion({ id, params: { name: name.trim() }, onClose: () => setModalOpen(false) });
    } else {
      await createRegion({ params: { name: name.trim(), status: true }, onClose: () => setModalOpen(false) });
    }
  };

  const columns: ColumnsType<NetworkRegion> = [
    { title: "Region Name", dataIndex: "name", key: "name" },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) => <span>{value ? formatDate(value) : "-"}</span>,
    },
    {
      title: "Status",
      key: "status",
      render: (_, row) => (
        <SwitchComponent
          isChecked={row.status !== false}
          onChange={async (checked) => {
            const id = row._id || row.id;
            if (!id) return;
            await updateStatus({ id, status: checked });
          }}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, row) => (
        <ActionFilter
          isEdit={true}
          isDelete={true}
          onEditAction={() => openEdit(row)}
          onDeleteAction={async () => {
            const id = row._id || row.id;
            if (!id) return;
            try {
              await deleteRegion(id).unwrap();
            } catch (error: any) {
              showToast(error?.data?.message || "Failed to delete region.", "error");
            }
          }}
        />
      ),
    },
  ];

  return (
    <>
      <PageMeta title="Network Regions" />
      <PageBreadcrumb pageTitle="Network Regions" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-2 flex items-center justify-end">
          <IconButton
            handleButtonAction={openAdd}
            title="Add Region"
            icon={<PlusCircleOutlined />}
          />
        </div>
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <TableContainer<NetworkRegion>
            columns={columns as any}
            data={rows}
            emptyText="Data Not Available"
            pagination={{
              current: page,
              pageSize,
              total,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              showTotal: (totalItems, range) =>
                `${range[0]}-${range[1]} of ${totalItems} records`,
            }}
            onChange={(pagination) => {
              setPage(pagination.current || 1);
              setPageSize(pagination.pageSize || PAGE_LIMIT);
            }}
          />
        )}
      </div>
      <Modal
        open={modalOpen}
        title={editing ? "Edit Region" : "Add Region"}
        onCancel={() => setModalOpen(false)}
        onOk={submit}
        okText={editing ? "Update" : "Add"}
        cancelText="Cancel"
        confirmLoading={creating || updating}
      >
        <Form layout="vertical">
          <Form.Item label="Region Name" required>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Victoria" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default NetworkRegionPage;
