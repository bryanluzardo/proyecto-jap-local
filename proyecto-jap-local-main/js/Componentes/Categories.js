export function Categories () {
    return (
        /* html */`<div id="filtros-superior">
         
       <label><input type="radio" name="options" id="sortAsc"> A-Z</label>
       
          <label><input type="radio" name="options" id="sortDesc"> Z-A</label>
          
                <label><input type="radio" name="options" id="sortByCount" checked> ↓</label>
                                                                                         </div>

<div id="filtros-inferior">
            <span>Cant.</span>
                  <input type="number" placeholder="min." id="rangeFilterCountMin">
                    
                     <input type="number" placeholder="máx." id="rangeFilterCountMax">
                     
                        <button id="rangeFilterCount">Filtrar</button>
                         
                           <button id="clearRangeFilter">Limpiar</button>
                                                                           </div>

                                         <div id="cat-list-container"></div>
        `
    )
}