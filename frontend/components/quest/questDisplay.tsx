import { Card, Text, Image, Badge, Button, Group } from "@mantine/core";
import { useRouter } from "next/router";

export default function QuestDisplay() {
  const router = useRouter();
  return (
    <div className="py-10">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            Current quests
          </h1>
        </div>
      </header>
      <main>
        <div className="mt-4 max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-row flex-wrap">
          <div className="max-w-sm w-1/2">
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Card.Section>
                <Image
                  src="https://images.unsplash.com/photo-1586980088852-088b1cd6c8eb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  height={160}
                  alt="Carbon retirement"
                />
              </Card.Section>

              <Group position="apart" mt="md" mb="xs">
                <Text weight={500}>Carbon Retirement Challenge #1</Text>
                <Badge color="pink" variant="light">
                  Active
                </Badge>
              </Group>

              <Text size="sm" color="dimmed">
                Retire Nature Carbon Tonne (NCT) and put yourself on the
                community leaderboard. Top retirees will get exclusive NFTs
                indicating your monthly and quarterly ranking which will give
                you all kinds of community utility later.
              </Text>

              <Button
                variant="light"
                color="blue"
                fullWidth
                mt="md"
                radius="md"
                onClick={() => {
                  router.push("/quest/1");
                }}
              >
                Join the quest now
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
