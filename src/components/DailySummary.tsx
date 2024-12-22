import { Box, Card, CardContent, Grid2, Typography } from "@mui/material";
import React from "react";
import { transaction } from "../types";
import { financeCalculations } from "../utils/financeCalculations";
import { formatCurrency } from "../utils/formatting";
import Grid from "@mui/material/Grid2";
interface DailySummaryProps {
    dailyTransactions: transaction[];
}
const DailySummary = ({ dailyTransactions }: DailySummaryProps) => {
    const { income, expense, balance } = financeCalculations(dailyTransactions);
    return (
        <Box>
            <Grid container spacing={2}>
                {/* 収入 */}
                <Grid size={{ xs: 8 }} display="flex">
                    <Card
                        sx={{
                            bgcolor: (theme) => theme.palette.grey[100],
                            flexGrow: 1,
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="body2"
                                noWrap
                                textAlign="center"
                            >
                                収入
                            </Typography>
                            <Typography
                                /* sx={{
                                    color: (theme) =>
                                        theme.palette.incomeColor.main,
                                }} */
                                textAlign="right"
                                fontWeight="fontWeightBold"
                                sx={{ wordBreak: "break-all" }}
                            >
                                ¥{formatCurrency(income)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* 支出 */}
                <Grid size={{ xs: 8 }} display={"flex"}>
                    <Card
                        sx={{
                            bgcolor: (theme) => theme.palette.grey[100],
                            flexGrow: 1,
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="body2"
                                noWrap
                                textAlign="center"
                            >
                                支出
                            </Typography>
                            <Typography
                                /* sx={{
                                    color: (theme) =>
                                        theme.palette.incomeColor.main,
                                }} */
                                textAlign="right"
                                fontWeight="fontWeightBold"
                                sx={{ wordBreak: "break-all" }}
                            >
                                ¥{formatCurrency(expense)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* 残高 */}
                <Grid size={{ xs: 8 }} display={"flex"}>
                    <Card
                        sx={{
                            bgcolor: (theme) => theme.palette.grey[100],
                            flexGrow: 1,
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="body2"
                                noWrap
                                textAlign="center"
                            >
                                残高
                            </Typography>
                            <Typography
                                /* sx={{
                                    color: (theme) =>
                                        theme.palette.incomeColor.main,
                                }} */
                                textAlign="right"
                                fontWeight="fontWeightBold"
                                sx={{ wordBreak: "break-all" }}
                            >
                                ¥{formatCurrency(balance)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};
export default DailySummary;