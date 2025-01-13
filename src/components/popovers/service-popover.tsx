import { Apps } from "@mui/icons-material";
import { Avatar, Badge, Box, IconButton, useTheme } from "@mui/material";
import { Fragment, useRef, useState } from "react";
import { FlexBox } from "../flex-box";
import PopoverLayout from "./popover-layout";

// dummy  data
const services = [
  {
    title: "Web Site",
    body: "2nd FFS - Website",
    image: "favicon.png",
    path: "http://2nd-ffs.fr/",
  },
  {
    title: "Discord",
    body: "Team community",
    image: "https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/62fddf0fde45a8baedcc7ee5_847541504914fd33810e70a0ea73177e%20(2)-1.png",
    path: "https://discord.gg/ECNeV6B7WC"
  }
];

// -----------------------------------------------------------------

type ListItemProps = {
  service: {
    image: string;
    title: string;
    body: string;
    path: string;
  };
};
function ListItem({ service }: ListItemProps) {
  const theme = useTheme();
  const colorbg =
    theme.palette.mode === "light" ? "secondary.light" : "divider";

  return (
    <a href={service.path} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
      <FlexBox
        p={2}
        alignItems="center"
        sx={{
          cursor: "pointer",
          "&:hover": { backgroundColor: colorbg },
        }}
      >
        <Avatar src={service.image} sx={{ width: 35, height: 35 }} />

        <Box ml={2}>
          <h5 style={{ margin: 0, paddingTop: '0.5em' }}>{service.title}</h5>
          <div style={{ display: 'block', paddingTop: '0.5em', fontWeight: 500, color: 'text.primary' }} >
            {service.body}
          </div>
        </Box>
      </FlexBox>
    </a>
  );
}

export function ServicePopover() {

  const anchorRef = useRef(null);

  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <IconButton ref={anchorRef} onClick={() => setOpen(true)}>
        <Badge color="error" badgeContent={0}>
          <Apps sx={{ color: "text.disabled" }} />
        </Badge>
      </IconButton>

      <PopoverLayout
        hiddenViewButton
        popoverOpen={open}
        anchorRef={anchorRef}
        title="Services"
        popoverClose={() => setOpen(false)}
      >
        {services.map((service, index) => (
          <ListItem service={service} key={index} />
        ))}
      </PopoverLayout>
    </Fragment>
  );

}