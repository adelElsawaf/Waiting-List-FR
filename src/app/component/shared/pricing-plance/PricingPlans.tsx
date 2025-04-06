import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Stack, Typography, Button, Grid, Card, CardContent, Container, } from "@mui/material";


export default function PricingPlans(){
    return (<>
        <Container maxWidth="lg">
            <Grid container spacing={4} sx={{ mt: 0 }}>
                {pricingPlans.map((plan, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3, border: plan.highlight ? "2px solid" : "none", borderColor: plan.highlight ? "secondary.main" : "transparent" }}>
                            <CardContent sx={{ textAlign: "start" }}>
                                <Typography variant="h5" fontWeight="bold" color="text.primary">{plan.title}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{plan.subtext}</Typography>
                                <Typography variant="h6" color="text.primary" fontWeight="bold" sx={{ mt: 1 }}>{plan.price}</Typography>

                                <Stack spacing={1} sx={{ mt: 2 }}>
                                    {plan.features.map((feature, idx) => (
                                        <Stack key={idx} direction="row" spacing={1} alignItems="center">
                                            <CheckCircleIcon color="secondary" fontSize="small" />
                                            <Typography variant="body2" color="text.primary">{feature}</Typography>
                                        </Stack>
                                    ))}
                                </Stack>

                                {plan.buttonText && (
                                    <Button variant={plan.highlight ? "contained" : "outlined"} 
                                    fullWidth
                                    color="secondary" href="/pricing" sx={{ mt: 3, py: 1 }}>
                                        {plan.buttonText}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Typography textAlign="start" mt={3} color="text.secondary">
                Transparent, hassle-free billing — no hidden fees, no auto-charges.
                Pay only what you use, with a 100% risk-free **7-day money-back guarantee** .
            </Typography>

        </Container>
    </>)
}

const pricingPlans = [
    { title: "Free Plan", price: "FREE", subtext: "Perfect for startups and individuals testing the waters.", features: ["Up to 5 pages", "Basic customization", "Standard support", "Unlimited visitors"], buttonText: "", highlight: false },
    { title: "Starter Plan", price: "$5 per extra page", subtext: "Grow your reach with more pages at a flexible rate.", features: ["Unlimited visitors", "Advanced customization", "Email notifications", "Premium support"], buttonText: "Upgrade to Starter", highlight: true },
    { title: "Pro Plan", price: "$20 / 10 Pages", subtext: "Ideal for businesses and large-scale campaigns.", features: ["Up to 10 pages", "Priority support", "Advanced analytics", "Custom branding"], buttonText: "Go Pro", highlight: false },
];