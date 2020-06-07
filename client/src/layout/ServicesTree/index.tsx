import * as React from "react";
import "./styles.scss";
import Tree from "../../components/Tree";
import { ConnectedProps } from "react-redux";
import { servicesTreeEnchancer } from "../../containers/ServicesTreeContainer";
import { usePrevious } from "../../hooks/usePrevious";

export type ServicesTreeProps = React.HTMLAttributes<HTMLDivElement> &
  ConnectedProps<typeof servicesTreeEnchancer>;

const ServicesTree: React.FC<ServicesTreeProps> = (props) => {
  const { service, config, onServiceSelect, onServiceViewSelect } = props;

  // const prevService = usePrevious(config);

  // const [serviceId, setService] = React.useState(service.serviceId);
  // React.useEffect(() => {

  // }, [service.serviceId]);

  return (
    <Tree
      onItemSelect={(item) => {
        const [key, serviceView] = item.split("_") as [
          string,
          ServiceConfigView
        ];
        onServiceViewSelect({ serviceView });
        // const id =;
        const keyService = service.services.find(
          (service) => service.key === key
        ) as IService;
        // if (!prevService || prevService.serviceId !== keyService.id) {
        // console.warn(config);
        onServiceSelect({ serviceId: keyService.id });
        // }
        // if (service.serviceView !== serviceView)
      }}
      items={service.services.map((v) => ({
        content: v.name,
        items: [
          { id: `${v.key}_config`, content: "Оповещения" },
          { id: `${v.key}_control`, content: "Управление" },
        ],
      }))}
    />
  );
};

export default ServicesTree;
