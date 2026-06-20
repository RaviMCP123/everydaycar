import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Form, Input, Modal, Skeleton } from "antd";
import type { ColumnsType } from "antd/es/table";
import { HolderOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ActionFilter from "@components/Table/Action";
import DraggableRow from "@components/Table/DraggableRow";
import IconButton from "@components/Table/IconButton";
import SwitchComponent from "@components/Table/Switch";
import TableContainer from "@components/Table/TableContainer";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import PageMeta from "@components/common/PageMeta";
import {
  useCreateNetworkRegionMutation,
  useDeleteNetworkRegionMutation,
  useGetNetworkRegionListQuery,
  useReorderNetworkRegionsMutation,
  useUpdateNetworkRegionMutation,
  useUpdateNetworkRegionStatusMutation,
} from "@services/networkRegionApi";
import type { NetworkRegion } from "interface/networkRegion";
import showToast from "@utils/toast";
import { formatDate } from "@utils/dateFormat";

function sortRegions(rows: NetworkRegion[]) {
  return [...rows].sort((a, b) => {
    const orderDiff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    if (orderDiff !== 0) return orderDiff;
    return (a.name || "").localeCompare(b.name || "");
  });
}

const NetworkRegionPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<NetworkRegion | null>(null);
  const [name, setName] = useState("");
  const [orderedRows, setOrderedRows] = useState<NetworkRegion[]>([]);
  const { data, isLoading } = useGetNetworkRegionListQuery();
  const [createRegion, { isLoading: creating }] = useCreateNetworkRegionMutation();
  const [updateRegion, { isLoading: updating }] = useUpdateNetworkRegionMutation();
  const [updateStatus] = useUpdateNetworkRegionStatusMutation();
  const [deleteRegion] = useDeleteNetworkRegionMutation();
  const [reorderRegions] = useReorderNetworkRegionsMutation();

  const rows = useMemo(() => sortRegions(data?.data ?? []), [data?.data]);

  useEffect(() => {
    setOrderedRows(rows);
  }, [rows]);

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

  const moveRow = useCallback(
    async (dragIndex: number, hoverIndex: number) => {
      if (dragIndex === hoverIndex) return;

      const nextRows = [...orderedRows];
      const [dragged] = nextRows.splice(dragIndex, 1);
      nextRows.splice(hoverIndex, 0, dragged);
      setOrderedRows(nextRows);

      const ids = nextRows
        .map((row) => row._id || row.id)
        .filter((id): id is string => Boolean(id));

      try {
        await reorderRegions({ ids }).unwrap();
      } catch (error: any) {
        showToast(error?.data?.message || "Failed to reorder regions.", "error");
        setOrderedRows(rows);
      }
    },
    [orderedRows, reorderRegions, rows],
  );

  const columns: ColumnsType<NetworkRegion> = [
    {
      title: "",
      key: "sort",
      width: 48,
      render: () => (
        <HolderOutlined className="cursor-move text-gray-400" />
      ),
    },
    {
      title: "Order",
      key: "sortOrder",
      width: 72,
      render: (_, __, index) => <span>{index + 1}</span>,
    },
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
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Drag rows to set the region order shown on the website.
          </p>
          <IconButton
            handleButtonAction={openAdd}
            title="Add Region"
            icon={<PlusCircleOutlined />}
          />
        </div>
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <DndProvider backend={HTML5Backend}>
            <TableContainer<NetworkRegion>
              columns={columns as any}
              data={orderedRows}
              emptyText="Data Not Available"
              pagination={false}
              onChange={() => undefined}
              components={{
                body: {
                  row: DraggableRow,
                },
              }}
              onRow={(_, index) => ({
                index: index ?? 0,
                moveRow,
              })}
            />
          </DndProvider>
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
