import {
  AssessmentOutlined,
  BarChartOutlined,
  Inventory2Outlined,
  LocalAtmOutlined,
  ReceiptLongOutlined,
  ShowChartOutlined,
  TrendingDownOutlined,
} from "@mui/icons-material";
import {
  Box,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";

import BestSellingReport from "../components/reports/BestSellingReport";
import ExpenseReport from "../components/reports/ExpenseReport";
import InventoryReport from "../components/reports/InventoryReport";
import LowStockReport from "../components/reports/LowStockReport";
import ProfitReport from "../components/reports/ProfitReport";
import SalesReport from "../components/reports/SalesReport";

type ReportTabPanelProps = {
  children: React.ReactNode;
  value: number;
  index: number;
};

function ReportTabPanel({
  children,
  value,
  index,
}: ReportTabPanelProps) {
  if (value !== index) {
    return null;
  }

  return (
    <Box
      role="tabpanel"
      aria-labelledby={`report-tab-${index}`}
      sx={{ pt: 3 }}
    >
      {children}
    </Box>
  );
}

function Reports() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: number
  ) => {
    setSelectedTab(newValue);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">
          Reports
        </Typography>

        <Typography color="text.secondary">
          Review sales, profit, expenses and inventory performance.
        </Typography>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            overflowX: "auto",
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="BarMaster reports"
            sx={{
              minHeight: 64,
              px: 1,
            }}
          >
            <Tab
              icon={<BarChartOutlined />}
              iconPosition="start"
              label="Sales"
              id="report-tab-0"
              sx={{ minHeight: 64 }}
            />

            <Tab
              icon={<LocalAtmOutlined />}
              iconPosition="start"
              label="Profit"
              id="report-tab-1"
              sx={{ minHeight: 64 }}
            />

            <Tab
              icon={<ReceiptLongOutlined />}
              iconPosition="start"
              label="Expenses"
              id="report-tab-2"
              sx={{ minHeight: 64 }}
            />

            <Tab
              icon={<Inventory2Outlined />}
              iconPosition="start"
              label="Inventory"
              id="report-tab-3"
              sx={{ minHeight: 64 }}
            />

            <Tab
              icon={<TrendingDownOutlined />}
              iconPosition="start"
              label="Low Stock"
              id="report-tab-4"
              sx={{ minHeight: 64 }}
            />

            <Tab
              icon={<ShowChartOutlined />}
              iconPosition="start"
              label="Best Selling"
              id="report-tab-5"
              sx={{ minHeight: 64 }}
            />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
            }}
          >
            <AssessmentOutlined color="action" />

            <Typography
              variant="subtitle1"
              fontWeight={700}
            >
              Business Reports
            </Typography>
          </Box>

          <ReportTabPanel
            value={selectedTab}
            index={0}
          >
            <SalesReport />
          </ReportTabPanel>

          <ReportTabPanel
            value={selectedTab}
            index={1}
          >
            <ProfitReport />
          </ReportTabPanel>

          <ReportTabPanel
            value={selectedTab}
            index={2}
          >
            <ExpenseReport />
          </ReportTabPanel>

          <ReportTabPanel
            value={selectedTab}
            index={3}
          >
            <InventoryReport />
          </ReportTabPanel>

          <ReportTabPanel
            value={selectedTab}
            index={4}
          >
            <LowStockReport />
          </ReportTabPanel>

          <ReportTabPanel
            value={selectedTab}
            index={5}
          >
            <BestSellingReport />
          </ReportTabPanel>
        </Box>
      </Paper>
    </Box>
  );
}

export default Reports;