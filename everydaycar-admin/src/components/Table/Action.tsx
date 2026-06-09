import React from "react";
import { Button, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { ActionButtonProps } from "interface/common";

const ActionButton: React.FC<ActionButtonProps> = ({
  onEditAction,
  onViewAction,
  onDeleteAction,
  isDelete,
  isDeleteDisabled,
  isEdit,
  isView,
  deleteTooltip,
  deleteConfirmTitle,
  showDeleteConfirm = true,
}) => {
  const deleteButton = (
    <Button
      type="link"
      icon={<DeleteOutlined />}
      onClick={onDeleteAction}
      disabled={isDeleteDisabled}
      className={`!border-none !min-w-0 !p-1 ${
        isDeleteDisabled
          ? "!bg-gray-300 !text-gray-500 cursor-not-allowed hover:!bg-gray-300"
          : "!bg-red-500 !text-white hover:!bg-red-600 hover:!opacity-90"
      }`}
    />
  );

  return (
    <div className="inline-flex items-center gap-2">
      {isEdit && (
        <Tooltip title="View/Edit Details">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={onEditAction}
            className="!bg-[#007BFF] !text-white hover:!bg-[#0066cc] hover:!opacity-90 !min-w-0 !p-1 !border-none"
          />
        </Tooltip>
      )}

      {isView && (
        <Tooltip title="View Details">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={onViewAction}
            className="!bg-[#003366] !text-white hover:!bg-[#004080] hover:!opacity-90 !min-w-0 !p-1 !border-none"
          />
        </Tooltip>
      )}

      {isDelete && (
        isDeleteDisabled ? (
          <Tooltip title={deleteTooltip || "Active categories cannot be deleted"}>
            <span>{deleteButton}</span>
          </Tooltip>
        ) : showDeleteConfirm ? (
          <Popconfirm
            title={deleteConfirmTitle || "Are you sure you want to delete this item?"}
            okText="Yes"
            cancelText="No"
            onConfirm={onDeleteAction}
          >
            <Tooltip title="Delete">
              {deleteButton}
            </Tooltip>
          </Popconfirm>
        ) : (
          <Tooltip title="Delete">{deleteButton}</Tooltip>
        )
      )}
    </div>
  );
};

export default ActionButton;
