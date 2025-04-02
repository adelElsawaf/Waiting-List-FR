import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import TableChartIcon from "@mui/icons-material/TableChart";
import { Submission } from "@/app/types/Submission";

interface PageSubmissionsProps {
    submissions: Submission[];
}

const PageSubmissions: React.FC<PageSubmissionsProps> = ({ submissions }) => {
    if (!submissions || !submissions.length) {
        return (
            <Typography textAlign="center" color="text.secondary">
                No submissions yet.
            </Typography>
        );
    }

    return (
        <TableContainer component={Paper} sx={{ borderRadius: "12px", overflow: "hidden", boxShadow: 2 }}>
            <Table>
                <TableHead >
                    <TableRow sx={{ backgroundColor: "#EEEEEE" }}>
                        <TableCell sx={{ fontWeight: "bold", color: "#333", display: "flex", alignItems: "center" , fontSize:"16px"}}><TableChartIcon color="secondary" sx={{ mr: 1 }} /> ID</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#333", fontSize: "16px" }}>Submitted At</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#333", fontSize: "16px" }}>Answers</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {submissions.map((submission, index) => (
                        <TableRow key={submission.submissionId} sx={{ backgroundColor: index % 2 === 0 ? "#FAFAFA" : "#FFF" , fontSize: "16px" }}>
                            <TableCell sx={{ fontSize: "16px" }}>{submission.submissionId}</TableCell>
                            <TableCell sx={{ fontSize : "16px"}} >{new Date(submission.submittedAt).toLocaleString()}</TableCell>
                            <TableCell>
                                {submission.answers.map((answer) => (
                                    <Typography key={answer.id} sx={{ fontSize: "16px", color: "#555" }}>
                                        <strong>{answer.fieldTitle}:</strong> {answer.answer}
                                    </Typography>
                                ))}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PageSubmissions;
