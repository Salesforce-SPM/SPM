export interface PackageXML {
  Package: {
    $: {
      xmlns: string;
    };
    types?: [{ members: string; name: string }];
  };
  //     <?xml version="1.0" encoding="UTF-8"?>
  // <Package xmlns="http://soap.sforce.com/2006/04/metadata">
  // <!-- https://developer.salesforce.com/docs/atlas.en-us.216.0.api_meta.meta/api_meta/meta_types_list.htm -->
  // 	<!-- Objeto padrão e customizado -->
  // 	<!-- faz o retrieve de todos os dados do objeto, campo, botões, links recordtype etc -->
  // 	<types>
  // 		<members>[api-do-objeto]</members>
  // 		<name>CustomObject</name>
  // 	</types>
}
