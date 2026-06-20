import React, { useMemo, useState } from "react";
import { Button, Form, Input, Modal, Select, Skeleton } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusCircleOutlined } from "@ant-design/icons";
import ActionFilter from "@components/Table/Action";
import IconButton from "@components/Table/IconButton";
import SwitchComponent from "@components/Table/Switch";
import TableContainer from "@components/Table/TableContainer";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import PageMeta from "@components/common/PageMeta";
import {
  useCreateNetworkAddressMutation,
  useDeleteNetworkAddressMutation,
  useGetNetworkAddressesQuery,
  useUpdateNetworkAddressMutation,
  useUpdateNetworkAddressStatusMutation,
} from "@services/networkAddressApi";
import { useGetNetworkRegionListQuery } from "@services/networkRegionApi";
import type { NetworkAddress } from "interface/networkAddress";
import showToast from "@utils/toast";
import { PAGE_LIMIT } from "@utils/constant/common";

const NetworkAddressPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_LIMIT);
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<NetworkAddress | null>(null);
  const [regionId, setRegionId] = useState("");
  const [addressEn, setAddressEn] = useState("");
  const [link, setLink] = useState("");
  const [email, setEmail] = useState("");
  const [statusText, setStatusText] = useState("Approved");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");

  const { data: regionListData } = useGetNetworkRegionListQuery();
  const { data, isLoading } = useGetNetworkAddressesQuery({
    page,
    limit: pageSize,
    ...(selectedRegion ? { regionId: selectedRegion } : {}),
  });
  const [createAddress, { isLoading: creating }] = useCreateNetworkAddressMutation();
  const [updateAddress, { isLoading: updating }] = useUpdateNetworkAddressMutation();
  const [updateStatus] = useUpdateNetworkAddressStatusMutation();
  const [deleteAddress] = useDeleteNetworkAddressMutation();

  const regionOptions = useMemo(
    () =>
      (regionListData?.data || []).map((r: any) => ({
        label: r.name,
        value: r._id || r.id,
      })),
    [regionListData?.data],
  );

  const rows = data?.data?.results ?? [];
  const total = data?.data?.pagination?.total ?? 0;

  const getRegionInfo = (row: NetworkAddress) => {
    if (typeof row.regionId === "string") return { id: row.regionId, name: "-" };
    return {
      id: row.regionId?._id || row.regionId?.id || "",
      name: row.regionId?.name || "-",
    };
  };

  const openAdd = () => {
    setEditing(null);
    setRegionId("");
    setAddressEn("");
    setLink("");
    setEmail("");
    setStatusText("Approved");
    setLatitude("");
    setLongitude("");
    setModalOpen(true);
  };

  const openEdit = (row: NetworkAddress) => {
    setEditing(row);
    const region = getRegionInfo(row);
    setRegionId(region.id);
    setAddressEn(row.address?.en || "");
    setLink(row.link || "");
    setEmail(row.email || "");
    setStatusText(row.statusText || "Approved");
    setLatitude(row.latitude !== undefined ? String(row.latitude) : "");
    setLongitude(row.longitude !== undefined ? String(row.longitude) : "");
    setModalOpen(true);
  };

  const submit = async () => {
    if (!regionId) {
      showToast("Please select a region.", "error");
      return;
    }
    if (!addressEn.trim()) {
      showToast("Address is required.", "error");
      return;
    }
    const trimmedEmail = email.trim();
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      showToast("Enter a valid email address.", "error");
      return;
    }
    const payload = {
      regionId,
      address: { en: addressEn.trim() },
      link: link.trim(),
      email: trimmedEmail,
      statusText: statusText.trim() || "Approved",
      ...(latitude.trim() ? { latitude: Number(latitude) } : {}),
      ...(longitude.trim() ? { longitude: Number(longitude) } : {}),
    };
    if (editing?._id || editing?.id) {
      const id = (editing._id || editing.id)!;
      await updateAddress({ id, params: payload, onClose: () => setModalOpen(false) });
    } else {
      await createAddress({ params: payload, onClose: () => setModalOpen(false) });
    }
  };

  const columns: ColumnsType<NetworkAddress> = [
    {
      title: "Region",
      key: "region",
      render: (_, row) => getRegionInfo(row).name,
    },
    {
      title: "Address",
      key: "address",
      render: (_, row) => row.address?.en || "-",
    },
    { title: "Link", dataIndex: "link", key: "link", ellipsis: true },
    { title: "Email", dataIndex: "email", key: "email", ellipsis: true },
    { title: "Status Text", dataIndex: "statusText", key: "statusText", ellipsis: true },
    {
      title: "Coordinates",
      key: "coordinates",
      render: (_, row) =>
        row.latitude !== undefined && row.longitude !== undefined
          ? `${row.latitude}, ${row.longitude}`
          : "-",
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
              await deleteAddress(id).unwrap();
            } catch (error: any) {
              showToast(error?.data?.message || "Failed to delete address.", "error");
            }
          }}
        />
      ),
    },
  ];

  return (
    <>
      <PageMeta title="Network Addresses" />
      <PageBreadcrumb pageTitle="Network Addresses" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-2 flex items-center justify-between gap-3">
          <Select
            allowClear
            placeholder="Filter by region"
            value={selectedRegion}
            onChange={(value) => setSelectedRegion(value)}
            options={regionOptions}
            style={{ minWidth: 240 }}
          />
          <IconButton
            handleButtonAction={openAdd}
            title="Add Address"
            icon={<PlusCircleOutlined />}
          />
        </div>
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <TableContainer<NetworkAddress>
            rowKey={(row) => row._id || row.id || row.address?.en || "row"}
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
        title={editing ? "Edit Address" : "Add Address"}
        onCancel={() => setModalOpen(false)}
        onOk={submit}
        confirmLoading={creating || updating}
        width={720}
      >
        <Form layout="vertical">
          <Form.Item label="Region" required>
            <Select
              placeholder="Select region"
              value={regionId || undefined}
              onChange={(value) => setRegionId(value)}
              options={regionOptions}
            />
          </Form.Item>
          <Form.Item label="Address (EN)" required>
            <Input
              value={addressEn}
              onChange={(e) => setAddressEn(e.target.value)}
              placeholder="e.g. 370 Hoddle St, Clifton Hill VIC 3068"
            />
          </Form.Item>
          <Form.Item label="Map Link">
            <Input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://maps.google.com/..."
            />
          </Form.Item>
          <Form.Item label="Email (optional)">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="info@repairer.com.au"
            />
          </Form.Item>
          <Form.Item label="Status Text">
            <Input
              value={statusText}
              onChange={(e) => setStatusText(e.target.value)}
              placeholder="Approved"
            />
          </Form.Item>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Form.Item label="Latitude">
              <Input
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="-37.8136"
              />
            </Form.Item>
            <Form.Item label="Longitude">
              <Input
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="144.9631"
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default NetworkAddressPage;
