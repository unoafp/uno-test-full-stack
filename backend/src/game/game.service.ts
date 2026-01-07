import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

interface ImageResponse {
    uuid: string;
    url: string;
    title: string;
}

export interface Card {
    id: string;
    uuid: string;
    url: string;
}

@Injectable()
export class GameService {
    constructor(private prisma: PrismaService) { }

    async initializeGame(username: string, run: string) {
        // 1. Ensure user exists
        let user = await this.prisma.user.findUnique({ where: { run } });
        if (!user) {
            user = await this.prisma.user.create({
                data: { username, run },
            });
        } else if (user.username !== username) {
            // Optional: Update username if it changed
            user = await this.prisma.user.update({
                where: { id: user.id },
                data: { username }
            });
        }

        // 2. Fetch images
        const deck = await this.generateDeck();

        return { user, deck };
    }

    async saveResult(userId: string, win: boolean, moves: number, time: number) {
        return this.prisma.gameResult.create({
            data: {
                userId,
                win,
                moves,
                time
            }
        });
    }

    async getHistory(run: string) {
        const user = await this.prisma.user.findUnique({ where: { run } });
        if (!user) return [];

        return this.prisma.gameResult.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });
    }

    private async generateDeck(): Promise<Card[]> {
        try {
            const response = await fetch('https://challenge-uno.vercel.app/api/images');
            if (!response.ok) throw new Error('Failed to fetch images');

            const images = (await response.json()) as ImageResponse[];

            // Select 6 random images
            const shuffledImages = images.sort(() => 0.5 - Math.random());
            const selected = shuffledImages.slice(0, 6);

            // Duplicate
            const pairs = [...selected, ...selected];

            // Shuffle pairs
            const deck = pairs
                .sort(() => 0.5 - Math.random())
                .map(img => ({
                    id: uuidv4(),
                    uuid: img.uuid,
                    url: img.url
                }));

            return deck;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Error generating deck');
        }
    }
}
