import * as React from "react";
import "./styles.scss";
import Tree from "../../components/Tree";

export type ServicesTreeProps = React.HTMLAttributes<HTMLDivElement> & {
  services: { name: string; id: number }[];
  onServiceSelect: (serviceId: number) => void;
};

const ServicesTree: React.FC<ServicesTreeProps> = (props) => {
  const { services, onServiceSelect } = props;
  return (
    <Tree
      onItemSelect={(item) => {
        const [serviceId] = item.split("_");
        const id = Number(serviceId);
        onServiceSelect(id);
      }}
      items={services.map((v) => ({
        content: v.name,
        items: [
          { id: `${v.id}_notice`, content: "Оповещения" },
          { id: `${v.id}_config`, content: "Подключение" },
        ],
      }))}
    />
  );
};

export default ServicesTree;
