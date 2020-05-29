import * as React from "react";
import "./styles.scss";
import { mergeClassNames, mergeProps } from "../../utils";
import DialogPopup from "../../components/DialogPopup";
import Input from "../../components/Input";
import { useInput } from "../../hooks/useInput";
import Form from "../../components/Form";
import Section from "../../components/Section";
import Button from "../../components/Button";
import { DataStatus } from "../../redux/types";
import Tree from "../../components/Tree";

export type ServicesTreeProps = React.HTMLAttributes<HTMLDivElement> & {
  services: { name: string; id: string }[];
};

const ServicesTree: React.FC<ServicesTreeProps> = (props) => {
  const { services } = props;
  return (
    <Tree
      onItemSelect={() => {}}
      items={services.map((v) => ({
        content: v.name,
        items: [
          { id: `${v.id}-notice`, content: "Оповещение" },
          { id: `${v.id}-config`, content: "Конфигурация" },
        ],
      }))}
    />
  );
};

export default ServicesTree;
