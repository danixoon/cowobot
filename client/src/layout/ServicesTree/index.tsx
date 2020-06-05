import * as React from "react";
import "./styles.scss";
import Tree from "../../components/Tree";
import { ConnectedProps } from "react-redux";
import { servicesTreeEnchancer } from "../../containers/ServicesTreeContainer";

export type ServicesTreeProps = React.HTMLAttributes<HTMLDivElement> &
  ConnectedProps<typeof servicesTreeEnchancer>;

const ServicesTree: React.FC<ServicesTreeProps> = (props) => {
  const { services, onServiceSelect } = props;
  return (
    <Tree
      onItemSelect={(item) => {
        const [serviceId, serviceView] = item.split("_") as [
          string,
          ServiceConfigView
        ];
        const id = Number(serviceId);
        onServiceSelect({ serviceId: id, serviceView });
      }}
      items={services.map((v) => ({
        content: v.name,
        items: [
          { id: `${v.id}_configuration`, content: "Оповещения" },
          { id: `${v.id}_connection`, content: "Подключение" },
        ],
      }))}
    />
  );
};

export default ServicesTree;
