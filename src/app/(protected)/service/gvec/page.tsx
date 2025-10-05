"use client";

import ListGVEC from "@/components/gvec/List";
import ListGVECCycle from "@/components/gvecCycle/List";
import ListGVECFinCycle from "@/components/gvecFinCycle/List";
import ListGVECRealisation from "@/components/gvecRealisation/List";
import { GVECItem } from "@/store/gvec/type";
import { GVECCycleItem } from "@/store/gvecCycle/type";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Stack, Tab } from "@mui/material";
import { useEffect, useState } from "react";

export default function GVECPage() {
  const [selectedGVEC, setSelectedGVEC] = useState<GVECItem | null>(null);
  const [selectedCycle, setSelectedCycle] = useState<GVECCycleItem | null>(
    null
  );
  const [tabSelected, setTabSelected] = useState<string>("realisation");

  useEffect(() => {
    setSelectedCycle(null);
  }, [selectedGVEC]);

  return (
    <Stack direction="column" gap={2}>
      {/* Niveau 1: GVEC Master */}
      <Stack direction="row" gap={2} alignItems="flex-start">
        <ListGVEC selected={selectedGVEC} setSelected={setSelectedGVEC} />

        {/* Niveau 2: Cycles du GVEC sélectionné */}
        {selectedGVEC && (
          <ListGVECCycle
            selectedGVEC={selectedGVEC}
            selected={selectedCycle}
            setSelected={setSelectedCycle}
            key={selectedGVEC.id}
          />
        )}
      </Stack>

      {/* Niveau 3: Réalisations et Fins de cycle du cycle sélectionné */}
      {selectedCycle && (
        <Stack direction="column">
          <TabContext value={tabSelected}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={(e: React.SyntheticEvent, v: string) =>
                  setTabSelected(v)
                }
                aria-label="lab API tabs example"
              >
                <Tab label="Réalisation" value="realisation" />
                <Tab label="Fin de cycle" value="fincycle" />
              </TabList>
            </Box>
            <TabPanel value="realisation" sx={{ padding: 0 }}>
              <ListGVECRealisation
                selectedGVECCycle={selectedCycle}
                key={`realisation-${selectedCycle.id}`}
              />
            </TabPanel>
            <TabPanel value="fincycle">
              <ListGVECFinCycle
                selectedGVECCycle={selectedCycle}
                key={`fincycle-${selectedCycle.id}`}
              />
            </TabPanel>
          </TabContext>
        </Stack>
      )}
    </Stack>
  );
}
