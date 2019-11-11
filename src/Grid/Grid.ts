import { ITableBuilder } from "../Builders/ITableBuilder";
import { IGrid } from "./IGrid";

export class Grid implements IGrid {
    private wrapper: HTMLElement;
    private tableBuilder: ITableBuilder;

    constructor(tableBuilder: ITableBuilder, wrapper: HTMLElement) {
        this.tableBuilder = tableBuilder;
        this.wrapper = wrapper;
        this.wrapper.addEventListener("click", this);
    }

    public render(): string {
        this.cleanHTML();
        return this.tableBuilder.buildTable(
            this.tableBuilder.buildTr(this.tableBuilder.buildKeys()) 
            + this.tableBuilder.buildTableBody()
        );
    }

    public handleEvent(event: MouseEvent): void {
        // TODO: decouple by using middlelayer which manages the events - something like EventsManager.ts
        // The Grid shouldn't know anything about setting a sorting strategy.
        this.tableBuilder.setSortingStrategyID((event.target as HTMLInputElement).id);
        this.wrapper.innerHTML = this.render();
    }

    private cleanHTML(): void {
        while (this.wrapper.firstElementChild !== null) {
            this.wrapper.removeChild(this.wrapper.firstElementChild);
        }
    }
}
