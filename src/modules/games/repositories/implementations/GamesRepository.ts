import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("games")
      .where("LOWER(games.title) LIKE LOWER(:titleSearch)", {
        titleSearch: `%${param}%`,
      })
      .getMany() as unknown as Game[];

    // Complete usando query builder;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT count(*) FROM games");
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const userWithGames = getRepository(User)
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.games", "game")
      .addSelect(["first_name", "last_name", "email"])
      .where("game.id = :id", { id })
      .getMany() as unknown as User[];

    return userWithGames;
  }
}
